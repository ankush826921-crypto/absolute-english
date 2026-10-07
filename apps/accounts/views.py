from django.shortcuts import render


def login_view(request):
    return render(request, "login.html")


def register_view(request):
    return render(request, "register.html")


def forgot_password_view(request):
    return render(request, "forgot_password.html")


def verify_otp_view(request):
    return render(request, "verify_otp.html")


def reset_password_view(request):
    return render(request, "reset_password.html")


def password_success_view(request):
    return render(request, "password_success.html")