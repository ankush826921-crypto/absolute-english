import secrets
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom manager for User model supporting email and username flexibility."""
    
    def create_user(self, email=None, username=None, password=None, **extra_fields):
        if not email and not username:
            raise ValueError("The Email or Username field must be set")

        if email:
            email = self.normalize_email(email)
            if not username:
                base_username = email.split('@')[0]
                username = base_username
                counter = 1
                while self.model.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1

        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        user = self.model(email=email, username=username, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email=email, username=username, password=password, **extra_fields)


class User(AbstractUser):
    """Custom User model for Absolute English."""
    email = models.EmailField(
        unique=True,
        error_messages={'unique': "A user with that email already exists."}
    )
    phone = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        error_messages={'unique': "A user with that phone number already exists."}
    )
    full_name = models.CharField(max_length=150, blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return self.email or self.username

    def get_full_name(self):
        if self.full_name:
            return self.full_name
        full = f"{self.first_name} {self.last_name}".strip()
        return full or self.username or self.email


class OTPVerification(models.Model):
    """Model to store OTP codes for Phone verification and Password reset."""
    PURPOSE_CHOICES = [
        ('registration', 'Registration Phone Verification'),
        ('password_reset', 'Password Reset Verification'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='otps'
    )
    email = models.EmailField(blank=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, db_index=True)
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = 'OTP Verification'
        verbose_name_plural = 'OTP Verifications'
        ordering = ['-created_at']

    def __str__(self):
        target = self.email or self.phone
        return f"{self.purpose} OTP for {target} ({self.otp_code})"

    @classmethod
    def generate_otp(cls, email="", phone="", purpose="registration", user=None, validity_minutes=10):
        """Generates a cryptographically secure 6-digit OTP code and invalidates older unverified ones."""
        email = (email or "").strip().lower()
        phone = (phone or "").strip()

        cls.objects.filter(
            email=email,
            phone=phone,
            purpose=purpose,
            is_verified=False
        ).update(is_verified=True)

        otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        expires_at = timezone.now() + timedelta(minutes=validity_minutes)

        otp_instance = cls.objects.create(
            user=user,
            email=email,
            phone=phone,
            otp_code=otp_code,
            purpose=purpose,
            expires_at=expires_at
        )
        return otp_instance

    def is_valid(self):
        """Checks if OTP is valid and not expired/exhausted."""
        if self.is_verified:
            return False, "OTP has already been used."
        if self.attempts >= 5:
            return False, "Maximum verification attempts exceeded. Please request a new OTP."
        if timezone.now() > self.expires_at:
            return False, "OTP has expired. Please request a new OTP."
        return True, "Valid"


class CourseEnrollment(models.Model):
    """Course and Batch Enrollment Information for Student Dashboard."""
    STATUS_CHOICES = [
        ('active', 'Active Student'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course_name = models.CharField(max_length=200, default="Absolute English Spoken & Pronunciation Masterclass")
    batch_name = models.CharField(max_length=200, default="Morning Batch A (Mon-Fri, 10:00 AM - 11:30 AM)")
    trainer_name = models.CharField(max_length=150, default="Prof. David Miller (Senior Native Trainer)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    progress_percent = models.IntegerField(default=45)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Course Enrollment'
        verbose_name_plural = 'Course Enrollments'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.course_name}"


class LiveClassSession(models.Model):
    """Live Class Session Information for Student Dashboard."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_classes', null=True, blank=True)
    topic = models.CharField(max_length=250, default="Real-Life Conversation Practice & Accent Training")
    instructor = models.CharField(max_length=150, default="Prof. Sarah Jenkins")
    scheduled_time = models.DateTimeField(default=timezone.now)
    meeting_link = models.URLField(default="https://zoom.us/j/123456789")
    is_live = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Live Class Session'
        verbose_name_plural = 'Live Class Sessions'

    def __str__(self):
        return self.topic


class StudentTest(models.Model):
    """Practice Test and Quiz Assessment for Student Dashboard."""
    STATUS_CHOICES = [
        ('pending', 'Pending / Available'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=200, default="IELTS & Spoken English Listening/Speaking Assessment #1")
    total_questions = models.IntegerField(default=25)
    duration_minutes = models.IntegerField(default=30)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    score = models.IntegerField(null=True, blank=True)
    total_marks = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Student Test'
        verbose_name_plural = 'Student Tests'

    def __str__(self):
        return f"{self.title} - {self.user.username}"
