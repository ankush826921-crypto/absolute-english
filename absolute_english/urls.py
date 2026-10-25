
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.contrib.sitemaps.views import sitemap

from apps import views
from apps.sitemaps import PublicPagesSitemap


sitemaps = {
    "pages": PublicPagesSitemap,
}


def robots_txt(request):
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin/\n"
        "Sitemap: https://absolute-english-v5rz.onrender.com/sitemap.xml\n"
    )
    return HttpResponse(content, content_type="text/plain")


urlpatterns = [
    path("admin/", admin.site.urls),

    # SEO files
    path("robots.txt", robots_txt, name="robots_txt"),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),

    # Website pages
    path("", views.home, name="home"),
    path("languages/", views.languages, name="languages"),
    path("courses/", views.courses, name="courses"),
    path("about/", views.about, name="about"),
    path("trainers/", views.trainers, name="trainers"),
    path("gallery/", views.gallery, name="gallery"),
    path("contact/", views.contact, name="contact"),
    path("book-demo/", views.book_demo, name="book_demo"),
    path("enroll/", views.enroll, name="enroll"),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
