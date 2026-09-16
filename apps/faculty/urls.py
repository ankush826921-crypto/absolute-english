from django.urls import path

urlpatterns = [
]

from apps.faculty import views
# from apps.views import FacultyView
from django.contrib.auth import views as auth_views




urlpatterns = [
    path('faculty/',views.FacultyView.as_view(),name='faculty'),

    path('faculty/courses/',views.FacultyCoursesView.as_view(),name='faculty-courses'),

    path('faculty/profile/',views.FacultyProfileView.as_view(),name='faculty-profile'),

    path('trial/class/',views.TrialClassView.as_view(),name='trial-class'),


    ]

