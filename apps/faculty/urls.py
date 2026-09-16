from django.urls import path
from apps.faculty import views


urlpatterns = [
    path('',views.FacultyView.as_view(),name='faculty'),

    path('courses/',views.FacultyCoursesView.as_view(),name='faculty-courses'),

    path('profile/',views.FacultyProfileView.as_view(),name='faculty-profile'),

    path('trial/class/',views.TrialClassView.as_view(),name='trial-class'),


    ]