from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

from . import pages


urlpatterns = [
    path("admin/", admin.site.urls),

    path("", TemplateView.as_view(template_name="home.html"), name="home"),

    path("accounts/", include("apps.accounts.urls")),
    path("programs/", include("apps.programs.urls")),
    path("faculty/", include("apps.faculty.urls")),
    path("testimonials/", include("apps.testimonials.urls")),
    path("gallery/", include("apps.gallery.urls")),
    path("enquiries/", include("apps.enquiries.urls")),
    path("chatbot/", include("apps.chatbot.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )


