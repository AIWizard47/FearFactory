from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserTag, FearLevel, MemberShip

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
        }
        return Response(data, status=status.HTTP_200_OK)




#---------------------TESTING-INSERTING--------------------#
# Inserting of UserTag
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

# Inserting of fear-level
class FearLevelUploadView(APIView):
    permission_classes = [IsAdminUser]  # or use custom permission

    def post(self, request):
        fear_level = request.data.get("fear",[])
        created = []
        for fear in fear_level:
            obj, _ = FearLevel.objects.get_or_create(
                name=fear.get('name'),
                description=fear.get('description')
            )
            created.append({'name': obj.name, 'description': obj.description})
        return Response({"created_tags": created}, status=status.HTTP_201_CREATED)
    
# Inserting of MemberShip
class MemberShipUploadView(APIView):
    permission_classes = [IsAdminUser]  # or use custom permission

    def post(self, request):
        member = request.data.get("member",[])
        created = []
        for fear in member:
            obj, _ = MemberShip.objects.get_or_create(
                name=fear.get('name'),
                description=fear.get('description'),
                perk=fear.get('perks')
            )
            created.append({'name': obj.name, 'description': obj.description, 'perk':obj.perk})
        return Response({"created_tags": created}, status=status.HTTP_201_CREATED)