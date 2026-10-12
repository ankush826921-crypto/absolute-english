from django.contrib import admin
from .models import Faculty,Course,TrialBooking


from django.contrib import admin
from .models import Faculty, Course, TrialBooking


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "rating", "students")
    search_fields = ("name", "designation")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "english_type", "level", "faculty")
    list_filter = ("english_type", "level")
    search_fields = ("title",)


@admin.register(TrialBooking)
class TrialBookingAdmin(admin.ModelAdmin):
    list_display = (
        "student_name",
        "email",
        "english_type",
        "faculty",
        "course",
        "status",
        "preferred_date",
        "preferred_time",
    )
    list_filter = ("status", "english_type")
    search_fields = ("student_name", "email", "phone")