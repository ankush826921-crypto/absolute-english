from django.db import models


class ContactMessage(models.Model):
    class Subject(models.TextChoices):
        COURSE = 'course', 'Course Enquiry'
        ADMISSION = 'admission', 'Admission'
        DEMO = 'demo', 'Free Demo'
        GENERAL = 'general', 'General Query'
        OTHER = 'other', 'Other'

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=20, choices=Subject.choices)
    message = models.TextField()
    consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f'{self.full_name} - {self.get_subject_display()}'
