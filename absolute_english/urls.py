from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from apps import views


urlpatterns = [
    path('admin/', admin.site.urls),

    # Main pages
    path('', views.home, name='home'),
    path('languages/', views.languages, name='languages'),
    path('courses/', views.courses, name='courses'),
    path('about/', views.about, name='about'),
    path('trainers/', views.trainers, name='trainers'),

    # Gallery and Contact Us
    path('gallery/', include('apps.gallery.urls')),
    path('contact/', include('apps.enquiries.urls')),

    path('book-demo/', views.book_demo, name='book_demo'),
    path('enroll/', include('apps.enroll.urls')),

    path(
        'trial/class/',
        RedirectView.as_view(
            url='/faculty/trial/class/',
            query_string=True,
            permanent=False,
        ),
    ),

    # American / British English
    path('american/', views.american, name='american'),
    path('british/', views.british, name='british'),

    # Apps
    path('accounts/', include('apps.accounts.urls')),
    path('programs/', include(('apps.programs.urls', 'programs'), namespace='programs')),
    path('faculty/', include('apps.faculty.urls')),
    path('testimonials/', include('apps.testimonials.urls')),
    path('enquiries/', include('apps.enquiries.urls')),
    path('chatbot/', include('apps.chatbot.urls')),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
