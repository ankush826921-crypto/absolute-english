from django.urls import path
from . import views


app_name = "accounts"


urlpatterns = [
    path(
        "login/",
        views.login_view,
        name="login",
    ),

    path(
        "register/",
        views.register_view,
        name="register",
    ),

    path(
        "forgot-password/",
        views.forgot_password_view,
        name="forgot_password",
    ),

    path(
        "verify-otp/",
        views.verify_otp_view,
        name="verify_otp",
    ),

    path(
        "reset-password/",
        views.reset_password_view,
        name="reset_password",
    ),

    path(
        "password-success/",
        views.password_success_view,
        name="password_success",
    ),
]