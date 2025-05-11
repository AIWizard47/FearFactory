from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserTag

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
        }
        return Response(data, status=status.HTTP_200_OK)

class UserTagUploadView(APIView):
    permission_classes = [IsAdminUser]  # or use custom permission

    def post(self, request):
        tags = request.data.get('tags', [])
        created = []
        for tag in tags:
            obj, _ = UserTag.objects.get_or_create(
                name=tag.get('name'),
                category=tag.get('category')
            )
            created.append({'name': obj.name, 'category': obj.category})
        return Response({"created_tags": created}, status=status.HTTP_201_CREATED)