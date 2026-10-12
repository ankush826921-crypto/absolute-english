import copy
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.template.context import Context

# Python 3.14 compatibility patch for Django 4.2 Context.__copy__ during test client rendering
def _patched_context_copy(self):
    return self.new()

Context.__copy__ = _patched_context_copy

from .models import OTPVerification

User = get_user_model()


class UserModelTests(TestCase):
    """Tests for custom User model and manager."""

    def test_create_user_success(self):
        user = User.objects.create_user(
            email='student@example.com',
            password='ComplexPassword123!',
            full_name='John Doe',
            phone='+919876543210'
        )
        self.assertEqual(user.email, 'student@example.com')
        self.assertEqual(user.full_name, 'John Doe')
        self.assertTrue(user.check_password('ComplexPassword123!'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.get_full_name(), 'John Doe')

    def test_create_superuser_success(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            username='adminuser',
            password='AdminPassword123!'
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)


class OTPVerificationModelTests(TestCase):
    """Tests for OTPVerification model."""

    def test_generate_otp(self):
        otp = OTPVerification.generate_otp(
            email='test@example.com',
            purpose='password_reset'
        )
        self.assertEqual(len(otp.otp_code), 6)
        self.assertTrue(otp.otp_code.isdigit())
        self.assertFalse(otp.is_verified)
        self.assertEqual(otp.attempts, 0)

        is_valid, msg = otp.is_valid()
        self.assertTrue(is_valid)

    def test_expired_otp_is_invalid(self):
        otp = OTPVerification.generate_otp(
            email='test@example.com',
            purpose='password_reset'
        )
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()

        is_valid, msg = otp.is_valid()
        self.assertFalse(is_valid)
        self.assertIn("expired", msg.lower())

    def test_exhausted_attempts_otp_is_invalid(self):
        otp = OTPVerification.generate_otp(
            email='test@example.com',
            purpose='password_reset'
        )
        otp.attempts = 5
        otp.save()

        is_valid, msg = otp.is_valid()
        self.assertFalse(is_valid)
        self.assertIn("exceeded", msg.lower())


class AccountViewAndAPITests(TestCase):
    """Integration tests for Accounts HTML views and REST API endpoints."""

    def setUp(self):
        self.client = Client()
        self.user_password = 'TestPassword123!'
        self.user = User.objects.create_user(
            email='existing@example.com',
            username='existinguser',
            password=self.user_password,
            full_name='Existing User',
            phone='+919800000000',
            is_phone_verified=True
        )

    def test_html_pages_render(self):
        pages = ['accounts:login', 'accounts:register', 'accounts:forgot_password', 'accounts:verify_otp', 'accounts:password_success']
        for page_name in pages:
            response = self.client.get(reverse(page_name))
            self.assertEqual(response.status_code, 200)

    def test_api_login_success(self):
        url = reverse('accounts:api_login')
        response = self.client.post(url, {
            'email': 'existing@example.com',
            'password': self.user_password
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')

    def test_api_login_invalid_password(self):
        url = reverse('accounts:api_login')
        response = self.client.post(url, {
            'email': 'existing@example.com',
            'password': 'WrongPassword123!'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'error')

    def test_full_otp_and_registration_flow(self):
        phone_num = '+919876543211'
        email_addr = 'newuser@example.com'

        # 1. Send OTP
        send_otp_url = reverse('accounts:api_send_otp')
        res1 = self.client.post(send_otp_url, {
            'target': phone_num,
            'purpose': 'registration'
        }, content_type='application/json')
        self.assertEqual(res1.status_code, 200)
        otp_code = OTPVerification.objects.filter(phone=phone_num, purpose='registration').latest('created_at').otp_code

        # 2. Verify OTP
        verify_otp_url = reverse('accounts:api_verify_otp')
        res2 = self.client.post(verify_otp_url, {
            'target': phone_num,
            'otp': otp_code,
            'purpose': 'registration'
        }, content_type='application/json')
        self.assertEqual(res2.status_code, 200)

        # 3. Register user
        register_url = reverse('accounts:api_register')
        res3 = self.client.post(register_url, {
            'full_name': 'New User',
            'email': email_addr,
            'phone': phone_num,
            'password': 'StrongPassword123!',
            'confirm_password': 'StrongPassword123!'
        }, content_type='application/json')
        self.assertEqual(res3.status_code, 201)
        self.assertTrue(User.objects.filter(email=email_addr).exists())

    def test_forgot_password_flow(self):
        # 1. Forgot password request
        res1 = self.client.post(reverse('accounts:api_forgot_password'), {
            'email': 'existing@example.com'
        }, content_type='application/json')
        self.assertEqual(res1.status_code, 200)
        otp_code = OTPVerification.objects.filter(email='existing@example.com', purpose='password_reset').latest('created_at').otp_code

        # 2. Verify OTP
        res2 = self.client.post(reverse('accounts:api_verify_otp'), {
            'otp': otp_code,
            'purpose': 'password_reset'
        }, content_type='application/json')
        self.assertEqual(res2.status_code, 200)

        # 3. Reset password
        res3 = self.client.post(reverse('accounts:api_reset_password'), {
            'password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }, content_type='application/json')
        self.assertEqual(res3.status_code, 200)

        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPassword123!'))

    def test_logout(self):
        self.client.force_login(self.user)
        res = self.client.post(reverse('accounts:api_logout'))
        self.assertEqual(res.status_code, 200)
