from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CheckAuth , SignUpView, LogoutView, FriendListView, SendFriendRequestView, AcceptFriendRequestView, RejectFriendRequestView ,FriendPendingSendListView, FriendPendingReceiveListView, GetUserView

urlpatterns = [
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API auth
    path('api/check-auth',CheckAuth.as_view(),name="check-auth"),
    path('api/signup',SignUpView.as_view(),name="signup"),
    
    #FriendsView
    path('users/friend-list-view/', FriendListView.as_view(),name='user-profile-view'),
    path('users/send-friend-request/', SendFriendRequestView.as_view(),name='send-friend-request'),
    path('users/accept-friend-request/', AcceptFriendRequestView.as_view(),name='accept-friend-request'),
    path('users/reject-friend-request/', RejectFriendRequestView.as_view(),name='reject-friend-request'),
    path('users/friend-pending-send-list-view/', FriendPendingSendListView.as_view(),name='friend-pending-send-list-view'),
    path('users/friend-pending-receive-list-view/', FriendPendingReceiveListView.as_view(),name='friend-pending-receive-list-view'),
    
    #logout
    path("user/logout/",LogoutView.as_view(),name='logout'),
    
    # View users
    path('users/view-users/', GetUserView.as_view(), name='view-users'),
    
]
