from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
import random
from datetime import timedelta


# ---------------------- DEFAULT FUNCTIONS ---------------------- #
# These MUST be above the UserProfile model

def get_default_fear_level():
    obj, created = FearLevel.objects.get_or_create(
        name="Beginner",
        defaults={"description": "Default beginner level"}
    )
    return obj.id


def get_default_membership():
    obj, created = MemberShip.objects.get_or_create(
        name="Free Haunter",
        defaults={
            "description": "Default free membership",
            "perk": "Basic access"
        }
    )
    return obj.id



#--------------------------REWARD-SYSTEM----------------------#

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self):
        return self.name

# this is a tag for users
class UserTag(models.Model):
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
    
# This is the progress Bar that show the user it experience and level
class FearLevel(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=100)
    def __str__(self):
        return self.name
    
# This is membership for my website.
class MemberShip(models.Model):
    name = models.CharField(max_length=20, default='Free Haunter')
    description = models.TextField(max_length=100)
    perk = models.TextField(max_length=100)
    def __str__(self):
        return self.name

#---------------------------USERS----------------------------#

# While user achieve Something then it get.
class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achieve = models.ForeignKey(Achievement,on_delete=models.CASCADE)
    date_earned = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username} - {self.achieve.name}"


# While user participate in any project or buy project then it get.
#Projects

class Experience(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    difficulty = models.CharField(max_length=50)
    trending = models.BooleanField(default=False)
    popular = models.BooleanField(default=False)
    image = models.ImageField(upload_to='experience_images/', blank=True, null=True)  # optional card image

    def __str__(self):
        return self.title

class UserExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(blank=True,null=True)  #update this one in all functions and every files. 
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.experience.title}"
    
    def save(self, *args, **kwargs):
        # Set end_date if not already set
        if not self.end_date:
            days = random.randint(8, 12)
            self.end_date = now() + timedelta(days=days)
        
        # Then check if completed
        if self.end_date and now() >= self.end_date:
            self.completed = True
        else:
            self.completed = False
        super().save(*args, **kwargs)

# Buy a any projects or assets etc...
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, default='Upcoming')
    def __str__(self):
        return self.user.username

# This is the progress Bar that show the user it experience and level
class Progress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    experiences_completed = models.IntegerField(default=0)
    achievements_unlocked = models.IntegerField(default=0)
    def __str__(self):
        return self.user.username


# While User Create a New Profile this create automatic.
# Extra profile info (optional, linked to User)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fear_level = models.ForeignKey(FearLevel, on_delete=models.SET_DEFAULT, default=get_default_fear_level)
    membership = models.ForeignKey(MemberShip, on_delete=models.SET_DEFAULT, default=get_default_membership)
    profile_tags = models.ManyToManyField('UserTag', blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username



