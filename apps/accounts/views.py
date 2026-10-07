import json
import logging
from django.shortcuts import render, redirect
from django.conf import settings
from django.urls import reverse
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import OTPVerification, CourseEnrollment, LiveClassSession, StudentTest
from .services import send_email_otp, send_sms_otp
from .forms import (
    UserLoginForm, UserRegistrationForm, ForgotPasswordForm,
    VerifyOTPForm, ResetPasswordForm
)
from .serializers import (
    UserSerializer, LoginSerializer, SendOTPSerializer,
    VerifyOTPSerializer, RegisterSerializer, ForgotPasswordSerializer,
    ResetPasswordSerializer
)

User = get_user_model()
logger = logging.getLogger(__name__)


def is_json_request(request):
    """Utility helper to detect JSON/AJAX requests."""
    return (
        request.content_type == 'application/json' or
        request.headers.get('x-requested-with') == 'XMLHttpRequest' or
        'application/json' in request.headers.get('accept', '')
    )


# ============================================================================
# HTML VIEWS
# ============================================================================

@ensure_csrf_cookie
def login_view(request):
    """Render Login page and handle HTML form submit."""
    if request.user.is_authenticated:
        return redirect('home')

    form = UserLoginForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.cleaned_data['user']
            remember = form.cleaned_data.get('remember', False)
            login(request, user, backend='apps.accounts.backends.EmailOrUsernameModelBackend')
            if remember:
                request.session.set_expiry(1209600)  # 14 days
            else:
                request.session.set_expiry(0)  # Browser close

            if is_json_request(request):
                return JsonResponse({'status': 'success', 'message': 'Logged in successfully.', 'redirect_url': reverse('home')})

            next_url = request.GET.get('next') or reverse('home')
            return redirect(next_url)
        else:
            if is_json_request(request):
                errors = form.errors.as_json()
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    return render(request, 'login.html', {'form': form})


@ensure_csrf_cookie
def register_view(request):
    """Render Register page and handle HTML form submit."""
    if request.user.is_authenticated:
        return redirect('home')

    form = UserRegistrationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            # Check phone OTP verification status in session or DB
            phone = form.cleaned_data['phone']
            is_verified = request.session.get(f'phone_verified_{phone}') or OTPVerification.objects.filter(
                phone=phone, purpose='registration', is_verified=True
            ).exists()

            if not is_verified:
                msg = "Please verify your phone number via OTP before completing registration."
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': msg}, status=400)
                messages.error(request, msg)
                return render(request, 'register.html', {'form': form})

            user = form.save()
            login(request, user, backend='apps.accounts.backends.EmailOrUsernameModelBackend')

            # Clear verified phone from session
            request.session.pop(f'phone_verified_{phone}', None)

            if is_json_request(request):
                return JsonResponse({'status': 'success', 'message': 'Account created successfully!', 'redirect_url': reverse('accounts:dashboard')})

            messages.success(request, "Account created successfully! Welcome to your dashboard.")
            return redirect('accounts:dashboard')
        else:
            if is_json_request(request):
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    return render(request, 'register.html', {'form': form})


@ensure_csrf_cookie
def forgot_password_view(request):
    """Render Forgot Password page and handle request."""
    if request.user.is_authenticated:
        return redirect('home')

    form = ForgotPasswordForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            user = User.objects.get(email__iexact=email)

            # Generate OTP
            otp_obj = OTPVerification.generate_otp(email=email, purpose='password_reset', user=user)
            send_email_otp(email, otp_obj.otp_code, purpose='password_reset')
            logger.info(f"Password reset OTP sent to {email}")

            # Store target email in session
            request.session['reset_email'] = email
            request.session['reset_email_verified'] = False

            if is_json_request(request):
                return JsonResponse({'status': 'success', 'message': 'OTP sent to your email.', 'redirect_url': reverse('accounts:verify_otp')})

            return redirect('accounts:verify_otp')
        else:
            if is_json_request(request):
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    return render(request, 'forgot_password.html', {'form': form})


@ensure_csrf_cookie
def verify_otp_view(request):
    """Render Verify OTP page and handle OTP check."""
    if request.user.is_authenticated:
        return redirect('home')

    reset_email = request.session.get('reset_email')
    form = VerifyOTPForm(request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            otp_code = form.cleaned_data['otp']
            if not reset_email:
                msg = "Session expired. Please request password reset again."
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': msg}, status=400)
                messages.error(request, msg)
                return redirect('accounts:forgot_password')

            # Fetch active OTP
            otp_record = OTPVerification.objects.filter(
                email=reset_email, purpose='password_reset', is_verified=False
            ).order_by('-created_at').first()

            if not otp_record:
                msg = "No pending OTP found. Please request a new OTP."
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': msg}, status=400)
                messages.error(request, msg)
                return render(request, 'verify_otp.html', {'form': form})

            valid, message = otp_record.is_valid()
            if not valid:
                otp_record.attempts += 1
                otp_record.save()
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': message}, status=400)
                messages.error(request, message)
                return render(request, 'verify_otp.html', {'form': form})

            if otp_record.otp_code != otp_code:
                otp_record.attempts += 1
                otp_record.save()
                msg = "Invalid OTP code. Please try again."
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': msg}, status=400)
                messages.error(request, msg)
                return render(request, 'verify_otp.html', {'form': form})

            # OTP is correct! Mark verified
            otp_record.is_verified = True
            otp_record.save()
            request.session['reset_email_verified'] = True

            if is_json_request(request):
                return JsonResponse({'status': 'success', 'message': 'OTP verified successfully.', 'redirect_url': reverse('accounts:reset_password')})

            return redirect('accounts:reset_password')
        else:
            if is_json_request(request):
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    return render(request, 'verify_otp.html', {'form': form, 'email': reset_email})


@ensure_csrf_cookie
def reset_password_view(request):
    """Render Reset Password page and process password update."""
    if request.user.is_authenticated:
        return redirect('home')

    reset_email = request.session.get('reset_email')
    reset_verified = request.session.get('reset_email_verified')

    if not reset_email or not reset_verified:
        messages.error(request, "Unauthorized access or session expired. Please verify your OTP first.")
        return redirect('accounts:forgot_password')

    form = ResetPasswordForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            try:
                user = User.objects.get(email__iexact=reset_email)
                user.set_password(form.cleaned_data['password'])
                user.save()

                # Clean session
                request.session.pop('reset_email', None)
                request.session.pop('reset_email_verified', None)

                if is_json_request(request):
                    return JsonResponse({'status': 'success', 'message': 'Password reset successful!', 'redirect_url': reverse('accounts:password_success')})

                return redirect('accounts:password_success')
            except User.DoesNotExist:
                msg = "User not found."
                if is_json_request(request):
                    return JsonResponse({'status': 'error', 'message': msg}, status=400)
                messages.error(request, msg)
        else:
            if is_json_request(request):
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    return render(request, 'reset_password.html', {'form': form})


def password_success_view(request):
    """Render Password Success confirmation page."""
    return render(request, 'password_success.html')


@require_http_methods(["GET", "POST"])
def logout_view(request):
    """Log out the current user and redirect to login."""
    logout(request)
    if is_json_request(request):
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully.', 'redirect_url': reverse('accounts:login')})
    messages.info(request, "You have been logged out.")
    return redirect('accounts:login')


@login_required
def dashboard_view(request):
    """Student dashboard with enrollment, live class, and test data."""
    user = request.user

    # Get or create a default enrollment for the user
    enrollment, _ = CourseEnrollment.objects.get_or_create(user=user)

    # Get a live class – prefer user-specific, else any global live one
    live_class = (
        LiveClassSession.objects.filter(user=user, is_live=True).first()
        or LiveClassSession.objects.filter(user__isnull=True, is_live=True).first()
    )
    # If none exists at all, create a default global one
    if live_class is None:
        live_class = LiveClassSession.objects.create(
            user=None,
            topic="Real-Life Conversation Practice & Accent Training",
            instructor="Prof. Sarah Jenkins",
            meeting_link="https://zoom.us/j/123456789",
            is_live=True,
        )

    # Get tests for the user
    tests = StudentTest.objects.filter(user=user).order_by('status', '-created_at')
    if not tests.exists():
        StudentTest.objects.create(
            user=user,
            title="IELTS & Spoken English Listening/Speaking Assessment #1",
            total_questions=25,
            duration_minutes=30,
            status='pending',
        )
        StudentTest.objects.create(
            user=user,
            title="Daily Vocabulary & Grammar Quiz #2",
            total_questions=15,
            duration_minutes=20,
            status='pending',
        )
        tests = StudentTest.objects.filter(user=user).order_by('status', '-created_at')

    return render(request, 'dashboard.html', {
        'user': user,
        'enrollment': enrollment,
        'live_class': live_class,
        'tests': tests,
    })


@login_required
def profile_view(request):
    """User profile endpoint."""
    user = request.user
    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        if full_name:
            user.full_name = full_name
            user.save()
            messages.success(request, "Profile updated successfully.")
    if is_json_request(request):
        return JsonResponse({
            'status': 'success',
            'user': UserSerializer(user).data
        })
    return render(request, 'profile.html', {'user': user})


# ============================================================================
# REST API ENDPOINTS FOR AJAX FRONTE ND INTEGRATION
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """JSON API endpoint for user login."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        remember = serializer.validated_data.get('remember', False)
        login(request, user, backend='apps.accounts.backends.EmailOrUsernameModelBackend')
        if remember:
            request.session.set_expiry(1209600)
        else:
            request.session.set_expiry(0)
        return Response({
            'status': 'success',
            'message': 'Logged in successfully.',
            'user': UserSerializer(user).data,
            'redirect_url': reverse('home')
        }, status=status.HTTP_200_OK)
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_send_otp(request):
    """JSON API endpoint to send OTP (phone or email)."""
    serializer = SendOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data.get('email', '')
        phone = serializer.validated_data.get('phone', '')
        purpose = serializer.validated_data.get('purpose', 'registration')

        # Rate limiting check: allow higher limit during testing
        max_allowed = 30 if getattr(settings, 'DEBUG', True) else 5
        recent_count = OTPVerification.objects.filter(
            email=email, phone=phone, purpose=purpose,
            created_at__gte=timezone.now() - timezone.timedelta(minutes=15)
        ).count()

        if recent_count >= max_allowed:
            return Response({
                'status': 'error',
                'message': 'Too many OTP requests. Please wait 15 minutes before trying again.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        user = User.objects.filter(email__iexact=email).first() if email else None
        otp_obj = OTPVerification.generate_otp(email=email, phone=phone, purpose=purpose, user=user)

        if email:
            send_email_otp(email, otp_obj.otp_code, purpose=purpose)
            request.session['reset_email'] = email
            request.session['reset_email_verified'] = False
        elif phone:
            send_sms_otp(phone, otp_obj.otp_code, purpose=purpose)

        return Response({
            'status': 'success',
            'message': f'OTP verification code sent to {email or phone}.'
        }, status=status.HTTP_200_OK)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_verify_otp(request):
    """JSON API endpoint to verify OTP."""
    serializer = VerifyOTPSerializer(data=request.data)
    if serializer.is_valid():
        otp_code = serializer.validated_data['otp']
        purpose = serializer.validated_data['purpose']
        target = serializer.validated_data.get('target', '').strip()

        email = request.session.get('reset_email', '')
        phone = ''

        if target:
            if '@' in target:
                email = target.lower()
            else:
                phone = target

        # Find latest pending OTP
        query = OTPVerification.objects.filter(purpose=purpose, is_verified=False)
        if email:
            query = query.filter(email__iexact=email)
        elif phone:
            query = query.filter(phone=phone)

        otp_record = query.order_by('-created_at').first()

        # Demo fallback check if code matches
        if not otp_record:
            return Response({'status': 'error', 'message': 'No pending OTP found. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        valid, msg = otp_record.is_valid()
        if not valid:
            otp_record.attempts += 1
            otp_record.save()
            return Response({'status': 'error', 'message': msg}, status=status.HTTP_400_BAD_REQUEST)

        if otp_record.otp_code != otp_code:
            otp_record.attempts += 1
            otp_record.save()
            return Response({'status': 'error', 'message': 'Invalid OTP code. Please check and try again.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as verified
        otp_record.is_verified = True
        otp_record.save()

        if purpose == 'registration' and (phone or otp_record.phone):
            target_phone = phone or otp_record.phone
            request.session[f'phone_verified_{target_phone}'] = True
        elif purpose == 'password_reset':
            request.session['reset_email_verified'] = True

        return Response({'status': 'success', 'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    """JSON API endpoint to register a new user."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        phone = serializer.validated_data['phone']
        is_verified = request.session.get(f'phone_verified_{phone}') or OTPVerification.objects.filter(
            phone=phone, purpose='registration', is_verified=True
        ).exists()

        if not is_verified:
            return Response({'status': 'error', 'message': 'Phone number must be verified via OTP first.'}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        login(request, user, backend='apps.accounts.backends.EmailOrUsernameModelBackend')
        request.session.pop(f'phone_verified_{phone}', None)

        return Response({
            'status': 'success',
            'message': 'Account created successfully!',
            'user': UserSerializer(user).data,
            'redirect_url': reverse('accounts:dashboard')
        }, status=status.HTTP_201_CREATED)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_forgot_password(request):
    """JSON API endpoint for requesting password reset OTP."""
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user = User.objects.get(email__iexact=email)

        otp_obj = OTPVerification.generate_otp(email=email, purpose='password_reset', user=user)
        send_email_otp(email, otp_obj.otp_code, purpose='password_reset')

        request.session['reset_email'] = email
        request.session['reset_email_verified'] = False

        return Response({
            'status': 'success',
            'message': 'Verification code sent to your email.',
            'redirect_url': reverse('accounts:verify_otp')
        }, status=status.HTTP_200_OK)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_reset_password(request):
    """JSON API endpoint for setting new password."""
    reset_email = request.session.get('reset_email')
    reset_verified = request.session.get('reset_email_verified')

    if not reset_email or not reset_verified:
        return Response({'status': 'error', 'message': 'Unauthorized or session expired. Please verify OTP first.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = User.objects.get(email__iexact=reset_email)
            user.set_password(serializer.validated_data['password'])
            user.save()

            request.session.pop('reset_email', None)
            request.session.pop('reset_email_verified', None)

            return Response({
                'status': 'success',
                'message': 'Password reset successfully.',
                'redirect_url': reverse('accounts:password_success')
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    """JSON API endpoint to logout."""
    logout(request)
    return Response({'status': 'success', 'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def api_me(request):
    """JSON API endpoint for getting and updating current user profile."""
    user = request.user
    if request.method in ['PUT', 'PATCH']:
        full_name = request.data.get('full_name')
        if full_name:
            user.full_name = full_name
            user.save()

    serializer = UserSerializer(user)
    return Response({'status': 'success', 'user': serializer.data}, status=status.HTTP_200_OK)