from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CheckAuth , SignUpView, LogoutView, FriendListView


urlpatterns = [
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API auth
    path('api/check-auth',CheckAuth.as_view(),name="check-auth"),
    path('api/signup',SignUpView.as_view(),name="signup"),
    
    #userProfileView
    path('users/friend-list-view/', FriendListView.as_view(),name='user-profile-view'),
    
    #logout
    path("user/logout/",LogoutView.as_view(),name='logout'),
]
