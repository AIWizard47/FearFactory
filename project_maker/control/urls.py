from django.urls import path
from .views import RegisterToExperience
urlpatterns = [
    path('register-to-experience/',RegisterToExperience.as_view(),name="register")
]
