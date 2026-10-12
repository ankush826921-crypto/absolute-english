from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    # HTML Page Views
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("forgot-password/", views.forgot_password_view, name="forgot_password"),
    path("verify-otp/", views.verify_otp_view, name="verify_otp"),
    path("reset-password/", views.reset_password_view, name="reset_password"),
    path("password-success/", views.password_success_view, name="password_success"),
    path("logout/", views.logout_view, name="logout"),
    path("profile/", views.profile_view, name="profile"),
    path("dashboard/", views.dashboard_view, name="dashboard"),

    # REST API Endpoints
    path("api/login/", views.api_login, name="api_login"),
    path("api/register/", views.api_register, name="api_register"),
    path("api/send-otp/", views.api_send_otp, name="api_send_otp"),
    path("api/verify-otp/", views.api_verify_otp, name="api_verify_otp"),
    path("api/forgot-password/", views.api_forgot_password, name="api_forgot_password"),
    path("api/reset-password/", views.api_reset_password, name="api_reset_password"),
    path("api/logout/", views.api_logout, name="api_logout"),
    path("api/me/", views.api_me, name="api_me"),
]