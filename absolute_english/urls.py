from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from apps import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('languages/', views.languages, name='languages'),
    path('courses/', views.courses, name='courses'),
    path('about/', views.about, name='about'),
    path('trainers/', views.trainers, name='trainers'),
    path('gallery/', views.gallery, name='gallery'),
    path('contact/', views.contact, name='contact'),
    path('book-demo/', views.book_demo, name='book_demo'),
    path('enroll/', views.enroll, name='enroll'),
    path('american/',views.american,name='american'),
    path('british/',views.british,name='british'),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)