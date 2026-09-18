from django.urls import path
from . import views

urlpatterns = [
    path("", views.program_list, name="program_list"),
    path("detail/", views.program_detail, name="program_detail"),
]