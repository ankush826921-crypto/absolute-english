import re
from django import forms
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()


class UserLoginForm(forms.Form):
    """Form for user authentication supporting Email or Username."""
    email = forms.CharField(
        label="Email or username",
        max_length=254,
        widget=forms.TextInput(attrs={
            'placeholder': 'you@example.com',
            'class': 'input-field',
            'id': 'loginEmail',
            'autocomplete': 'username',
        })
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Enter your password',
            'class': 'input-field',
            'id': 'loginPassword',
            'autocomplete': 'current-password',
        })
    )
    remember = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'name': 'remember'})
    )

    def clean(self):
        cleaned_data = super().clean()
        login_input = cleaned_data.get('email', '').strip()
        password = cleaned_data.get('password', '')

        if login_input and password:
            user = authenticate(username=login_input, password=password)

            if not user:
                raise ValidationError("Invalid email/username or password. Please check your credentials.")

            if not user.is_active:
                raise ValidationError("This account is inactive. Please contact support.")

            cleaned_data['user'] = user

        return cleaned_data


class UserRegistrationForm(forms.ModelForm):
    """Form for registering a new User."""
    full_name = forms.CharField(
        max_length=150,
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': 'Your full name',
            'id': 'fullName',
            'autocomplete': 'name',
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'placeholder': 'you@example.com',
            'id': 'registerEmail',
            'autocomplete': 'email',
        })
    )
    phone = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': '+91 98765 43210',
            'id': 'phone',
            'autocomplete': 'tel',
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Create a password',
            'id': 'registerPassword',
            'autocomplete': 'new-password',
        })
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Repeat your password',
            'id': 'confirmPassword',
            'autocomplete': 'new-password',
        })
    )
    terms = forms.BooleanField(
        required=True,
        error_messages={'required': 'You must accept the terms and conditions.'}
    )

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password']

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError("A user with this email address already exists.")
        return email

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip()
        # Clean non-digit characters except leading +
        clean_digits = re.sub(r'[^\d+]', '', phone)
        if len(re.sub(r'\D', '', clean_digits)) < 7:
            raise ValidationError("Please enter a valid phone number.")
        if User.objects.filter(phone=clean_digits).exists():
            raise ValidationError("A user with this phone number already exists.")
        return clean_digits

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password:
            if password != confirm_password:
                self.add_error('confirm_password', "Passwords do not match.")
            else:
                try:
                    validate_password(password)
                except ValidationError as e:
                    self.add_error('password', e)

        return cleaned_data

    def save(self, commit=True):
        full_name = self.cleaned_data.get('full_name', '')
        phone = self.cleaned_data.get('phone', '')
        password = self.cleaned_data.get('password')

        user = User.objects.create_user(
            email=self.cleaned_data['email'],
            password=password,
            phone=phone,
            full_name=full_name,
            is_phone_verified=True,
        )
        return user


class ForgotPasswordForm(forms.Form):
    """Form to request password reset OTP."""
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'placeholder': 'you@example.com',
            'id': 'forgotEmail',
            'autocomplete': 'email',
        })
    )

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip().lower()
        if not User.objects.filter(email__iexact=email).exists():
            raise ValidationError("No user found with this email address.")
        return email


class VerifyOTPForm(forms.Form):
    """Form to verify 6-digit OTP."""
    otp = forms.CharField(
        max_length=6,
        min_length=6,
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'otpCode',
            'maxlength': '6'
        })
    )

    def clean_otp(self):
        otp = self.cleaned_data.get('otp', '').strip()
        if not re.match(r'^\d{6}$', otp):
            raise ValidationError("OTP must be exactly 6 numeric digits.")
        return otp


class ResetPasswordForm(forms.Form):
    """Form to reset user password."""
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Enter your new password',
            'id': 'newPassword',
            'autocomplete': 'new-password',
        })
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Repeat your new password',
            'id': 'confirmNewPassword',
            'autocomplete': 'new-password',
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password:
            if password != confirm_password:
                self.add_error('confirm_password', "Passwords do not match.")
            else:
                try:
                    validate_password(password)
                except ValidationError as e:
                    self.add_error('password', e)

        return cleaned_data
