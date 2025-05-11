from django.contrib import admin
from .models import FeedbackAboutUs, FeedbackContactUs
# Register your models here.

admin.site.register(FeedbackAboutUs)
admin.site.register(FeedbackContactUs)