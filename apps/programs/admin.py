from django.contrib import admin
from .models import Program, Enquiry


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "level",
        "duration",
        "mode",
        "is_active",
        "created_at",
    )

    list_filter = (
        "level",
        "is_active",
    )

    search_fields = (
        "name",
        "short_description",
        "description",
    )


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "email",
        "phone",
        "program",
        "created_at",
    )

    list_filter = (
        "program",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "phone",
        "course",
    )