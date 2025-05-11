from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HelloView , SignUpView, FollowUserView, UnfollowUserView, UserProfileView


urlpatterns = [
    
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API auth
    path('api/hello',HelloView.as_view(),name="hello"),
    path('api/signup',SignUpView.as_view(),name="signup"),
    
    #friends
    path('users/<int:user_id>/follow/', FollowUserView.as_view(), name='follow-user'), #post method
    path('users/<int:user_id>/unfollow/', UnfollowUserView.as_view(), name='unfollow-user'), #delete method
    
    #userProfileView
    path('users/userprofile/', UserProfileView.as_view(),name='user-profile-view')

]
