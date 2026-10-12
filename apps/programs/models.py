from django.db import models


class Program(models.Model):

    LEVEL_CHOICES = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    name = models.CharField(max_length=150)

    short_description = models.TextField()

    description = models.TextField()

    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES
    )

    duration = models.CharField(
        max_length=50,
        default="12 Weeks"
    )

    mode = models.CharField(
        max_length=50,
        default="Online / Offline"
    )

    highlights = models.TextField(
        blank=True
    )

    learning_outcomes = models.TextField(
        blank=True
    )

    curriculum = models.TextField(
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class Enquiry(models.Model):

    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="enquiries",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)

    email = models.EmailField()
    

    phone = models.CharField(max_length=15)

    course = models.CharField(
        max_length=100,
        blank=True
    )

    message = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name