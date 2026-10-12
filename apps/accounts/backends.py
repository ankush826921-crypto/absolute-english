from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailOrUsernameModelBackend(ModelBackend):
    """Custom authentication backend enabling login via either email address or username."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        login_id = username or kwargs.get('email')
        if not login_id or not password:
            return None

        user = None
        login_id = login_id.strip()

        if '@' in login_id:
            try:
                user = User.objects.get(email__iexact=login_id)
            except User.DoesNotExist:
                user = None
        
        if not user:
            try:
                user = User.objects.get(username__iexact=login_id)
            except User.DoesNotExist:
                user = None

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None
