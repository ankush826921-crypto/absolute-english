from django.db import models


class GalleryImage(models.Model):

    CATEGORY_CHOICES = [
        ('achievements', 'Achievements'),
        ('real_life', 'Real-Life Conversations'),
        ('vocabulary', 'Vocabulary'),
        ('classrooms', 'Classrooms'),
        ('students', 'Students'),
        ('challenges', 'Challenges'),
    ]

    title = models.CharField(max_length=200)

    image = models.ImageField(
        upload_to='gallery/'
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES
    )

    description = models.TextField(
        blank=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'

    def __str__(self):
        return self.title