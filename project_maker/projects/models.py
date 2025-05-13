from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    PROJECT_TYPES = [
        ('WEB', 'Website'),
        ('APP', 'Android App'),
        ('GAME', 'Game'),
        ('MODEL', '3D Model'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    project_type = models.CharField(max_length=10, choices=PROJECT_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    launch_date = models.DateField()
    is_premium = models.BooleanField(default=False)
    template_available = models.BooleanField(default=False)
    achievement_tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    user_tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated user rewards or categories")
    image = models.ImageField(upload_to='project_images/', blank=True, null=True)  # optional card image

    def __str__(self):
        return f"{self.title} ({self.get_project_type_display()})"
