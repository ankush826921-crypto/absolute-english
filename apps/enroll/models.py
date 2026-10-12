from django.db import models

class Enrollment(models.Model):
    LANGUAGE_CHOICES = [
        ('American English', 'American English'),
        ('British English', 'British English'),
    ]   
    LEVEL_CHOICES = [
        ('A1 - Beginner', 'A1 - Beginner'),
        ('A2 - Elementary', 'A2 - Elementary'),
        ('B1 - Intermediate', 'B1 - Intermediate'),
        ('B2 - Upper Intermediate', 'B2 - Upper Intermediate'),
        ('C1 - Advanced', 'C1 - Advanced'),
    ]

    first_name = models.CharField(max_length=50)
    last_name  = models.CharField(max_length=50)
    email      = models.EmailField()
    phone      = models.CharField(max_length=20)
    language   = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
    level      = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    address    = models.TextField()
    agree_terms = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"