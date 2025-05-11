from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HelloView , SignUpView

urlpatterns = [
    
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API auth
    path('api/hello',HelloView.as_view(),name="hello"),
    path('api/signup',SignUpView.as_view(),name="signup"),
]
