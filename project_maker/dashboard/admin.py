from django.contrib import admin
from .models import UserTag, Achievement, Experience, Booking, Progress, UserProfile
# Register your models here.

admin.site.register(UserTag)
admin.site.register(Achievement)
admin.site.register(Experience)
admin.site.register(Booking)
admin.site.register(Progress)
admin.site.register(UserProfile)
