from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from .serializers import FeedbackAboutUsSerializer, FeedbackContactUsSerializer
from .models import FeedbackAboutUs


# Create your views here.
class FeedbackAboutUs(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = FeedbackAboutUsSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "You successfully delivered the message to us."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class FeedbackContactUs(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = FeedbackContactUsSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "You successfully delivered the message to us."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )