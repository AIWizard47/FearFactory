from django.urls import path
from .views import UserDetails, UserTagUploadView
urlpatterns = [
    path("users/",UserDetails.as_view(),name='user-details'),
    path('api/tags/upload/', UserTagUploadView.as_view(), name='tag-upload'),
]
