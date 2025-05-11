from django.db import models
from django.contrib.auth.models import User

# Optional tags for user profile
class UserTag(models.Model):
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    date_earned = models.DateField(auto_now_add=True)

#Projects
class Experience(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    difficulty = models.CharField(max_length=50)
    trending = models.BooleanField(default=False)
    popular = models.BooleanField(default=False)

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, default='Upcoming')

class Progress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    experiences_completed = models.IntegerField(default=0)
    achievements_unlocked = models.IntegerField(default=0)
    
class MemberShip(models.Model):
    name = models.CharField(max_length=20, default='Free')
    def __str__(self):
        return self.name
    
class FearLevel(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=100)
    def __str__(self):
        return self.name

# Extra profile info (optional, linked to User)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fear_level = models.OneToOneField(FearLevel, on_delete=models.SET_NULL, null=True, blank=True)
    membership = models.OneToOneField(MemberShip, on_delete=models.SET_NULL, null=True, blank=True)
    profile_tags = models.ManyToManyField('UserTag', blank=True)

    def __str__(self):
        return self.user.username



