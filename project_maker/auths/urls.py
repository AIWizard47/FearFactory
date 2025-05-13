from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HelloView , SignUpView, LogoutView, FriendListView


urlpatterns = [
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API auth
    path('api/hello',HelloView.as_view(),name="hello"),
    path('api/signup',SignUpView.as_view(),name="signup"),
    
    #userProfileView
    path('users/friend-list-view/', FriendListView.as_view(),name='user-profile-view'),
    
    #logout
    path("user/logout/",LogoutView.as_view(),name='logout'),
]
