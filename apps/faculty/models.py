from django.db import models


class Faculty(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    image = models.ImageField(upload_to="faculty/", blank=True, null=True)
    experience = models.CharField(max_length=50, blank=True)
    rating = models.DecimalField(
    max_digits=2,
    decimal_places=1,
    default=0)
    students = models.PositiveIntegerField(default=0)

    bio = models.TextField(blank=True)
    methodology = models.TextField(blank=True)

    qualifications = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    specializations = models.JSONField(default=list, blank=True)
    availability = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Course(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    english_type = models.CharField(
        max_length=20,
        choices=[
            ("american", "American English"),
            ("british", "British English"),
        ]
    )

    duration = models.CharField(max_length=50)
    level = models.CharField(max_length=50)

    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TrialBooking(models.Model):
    student_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)

    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="trial_bookings"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    english_type = models.CharField(
        max_length=20,
        choices=[
            ("american", "American English"),
            ("british", "British English"),
        ]
    )

    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    message = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="pending",
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("cancelled", "Cancelled"),
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.student_name