from django.urls import path
from .views import UserDetails, UserTagUploadView, FearLevelUploadView, MemberShipUploadView, AchievementsUploadView
urlpatterns = [
    path("users/",UserDetails.as_view(),name='user-details'),
    path('api/tags/upload/', UserTagUploadView.as_view(), name='tag-upload'),
    path('api/fear-level/',FearLevelUploadView.as_view(),name="fear-level"),
    path('api/member-ship/',MemberShipUploadView.as_view(),name="member-ship"),
    path('api/achievement/',AchievementsUploadView.as_view(),name='achievement'),
]
