from django.urls import path
from . import views

urlpatterns = [
    path('', views.enroll_view, name='enroll'),
    # baaki aapke existing URLs...
]