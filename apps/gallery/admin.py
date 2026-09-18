from django.contrib import admin
from .models import GalleryImage


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'category',
        'is_featured',
        'created_at',
    )

    list_filter = (
        'category',
        'is_featured',
    )

    search_fields = (
        'title',
        'description',
    )

    list_editable = (
        'is_featured',
    )