import re
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import OTPVerification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User object representation."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'full_name',
            'is_email_verified', 'is_phone_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login credentials."""
    email = serializers.CharField(required=True, label="Email or username")
    password = serializers.CharField(required=True, write_only=True)
    remember = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        login_input = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        if not login_input or not password:
            raise serializers.ValidationError("Both email/username and password are required.")

        user = authenticate(username=login_input, password=password)

        if not user:
            raise serializers.ValidationError({"detail": "Invalid email/username or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        attrs['user'] = user
        return attrs


class SendOTPSerializer(serializers.Serializer):
    """Serializer for requesting a new OTP via phone or email."""
    target = serializers.CharField(required=True, help_text="Phone number or Email address")
    purpose = serializers.ChoiceField(
        choices=['registration', 'password_reset'],
        default='registration'
    )

    def validate(self, attrs):
        target = attrs.get('target', '').strip()
        purpose = attrs.get('purpose')

        if '@' in target:
            # Email target
            email = target.lower()
            if purpose == 'password_reset' and not User.objects.filter(email__iexact=email).exists():
                raise serializers.ValidationError({"target": "No user found with this email address."})
            attrs['email'] = email
            attrs['phone'] = ''
        else:
            # Phone target
            phone_digits = re.sub(r'[^\d+]', '', target)
            if len(re.sub(r'\D', '', phone_digits)) < 7:
                raise serializers.ValidationError({"target": "Please enter a valid phone number."})
            if purpose == 'registration' and User.objects.filter(phone=phone_digits).exists():
                raise serializers.ValidationError({"target": "A user with this phone number already exists."})
            attrs['phone'] = phone_digits
            attrs['email'] = ''

        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying an OTP code."""
    target = serializers.CharField(required=False, allow_blank=True)
    otp = serializers.CharField(max_length=6, min_length=6, required=True)
    purpose = serializers.ChoiceField(
        choices=['registration', 'password_reset'],
        default='registration'
    )

    def validate_otp(self, value):
        if not re.match(r'^\d{6}$', value.strip()):
            raise serializers.ValidationError("OTP must be exactly 6 numeric digits.")
        return value.strip()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering a new user."""
    full_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(max_length=20, required=True)
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'confirm_password']

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email

    def validate_phone(self, value):
        phone_digits = re.sub(r'[^\d+]', '', value.strip())
        if len(re.sub(r'\D', '', phone_digits)) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        if User.objects.filter(phone=phone_digits).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return phone_digits

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        email = validated_data['email']
        password = validated_data['password']
        phone = validated_data['phone']
        full_name = validated_data['full_name']

        user = User.objects.create_user(
            email=email,
            password=password,
            phone=phone,
            full_name=full_name,
            is_phone_verified=True
        )
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for requesting password reset code via email."""
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if not User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("No user account found with this email address.")
        return email


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for resetting password."""
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs
