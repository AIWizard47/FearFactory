from django.urls import path
from .views import FeedbackAboutUs, FeedbackContactUs

urlpatterns = [
    path("about-us/",FeedbackAboutUs.as_view(),name="about-us-feedback"),
    path("contact-us/",FeedbackContactUs.as_view(),name="contact-us-feedback"),
]
