from django.db import models

# Create your models here.
class FeedbackAboutUs(models.Model):
    user_name = models.CharField(max_length=20)
    user_email = models.EmailField(max_length=100)
    user_subject = models.CharField(max_length=200)
    user_message = models.CharField(max_length=2000)
    def __str__(self): 
        return self.user_name
    
class FeedbackContactUs(models.Model):
    user_name = models.CharField(max_length=20)
    user_email = models.EmailField(max_length=100)
    user_number = models.CharField(max_length=10)
    user_subject = models.CharField(max_length=200)
    user_message = models.CharField(max_length=2000)
    user_subscribe = models.BooleanField(default=False)
    def __str__(self): 
        return self.user_name