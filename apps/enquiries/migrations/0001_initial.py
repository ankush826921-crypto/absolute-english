# Generated manually to keep the Contact Us backend migration self-contained.

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ContactMessage',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('full_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=20)),
                (
                    'subject',
                    models.CharField(
                        choices=[
                            ('course', 'Course Enquiry'),
                            ('admission', 'Admission'),
                            ('demo', 'Free Demo'),
                            ('general', 'General Query'),
                            ('other', 'Other'),
                        ],
                        max_length=20,
                    ),
                ),
                ('message', models.TextField()),
                ('consent', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Contact Message',
                'verbose_name_plural': 'Contact Messages',
                'ordering': ['-created_at'],
            },
        ),
    ]
