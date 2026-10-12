from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, OTPVerification, CourseEnrollment, LiveClassSession, StudentTest


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model."""
    list_display = (
        'email', 'username', 'full_name', 'phone',
        'is_email_verified', 'is_phone_verified', 'is_staff', 'is_active', 'created_at'
    )
    list_filter = (
        'is_staff', 'is_superuser', 'is_active',
        'is_email_verified', 'is_phone_verified', 'groups'
    )
    search_fields = ('email', 'username', 'full_name', 'phone')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('full_name', 'email', 'phone', 'first_name', 'last_name')}),
        (_('Verification status'), {'fields': ('is_email_verified', 'is_phone_verified')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'phone', 'password1', 'password2'),
        }),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    """Admin configuration for OTPVerification model."""
    list_display = (
        'target_display', 'otp_code', 'purpose',
        'is_verified', 'attempts', 'expires_at', 'created_at'
    )
    list_filter = ('purpose', 'is_verified', 'created_at')
    search_fields = ('email', 'phone', 'otp_code')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def target_display(self, obj):
        return obj.email or obj.phone
    target_display.short_description = 'Target (Email/Phone)'


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course_name', 'batch_name', 'trainer_name', 'status', 'progress_percent', 'enrolled_at')
    list_filter = ('status', 'course_name')
    search_fields = ('user__email', 'user__full_name', 'course_name', 'batch_name')


@admin.register(LiveClassSession)
class LiveClassSessionAdmin(admin.ModelAdmin):
    list_display = ('topic', 'instructor', 'scheduled_time', 'is_live', 'meeting_link')
    list_filter = ('is_live',)
    search_fields = ('topic', 'instructor')


@admin.register(StudentTest)
class StudentTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'total_questions', 'duration_minutes', 'status', 'score', 'total_marks')
    list_filter = ('status',)
    search_fields = ('title', 'user__email', 'user__full_name')
