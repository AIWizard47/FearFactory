from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserTag, FearLevel, MemberShip, UserProfile, Achievement, UserAchievement, UserExperience, Experience, Achievement

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            user_experience = UserExperience.objects.filter(user=user)
            
            total_count = Experience.objects.all().count()
            print(total_count)
            count = user_experience.count()
            print(count)
            
        except (UserProfile.DoesNotExist):
            return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "username": user.username.capitalize(),
            "membership": user_profile.membership.name,
            "membership_description" : user_profile.membership.description,
            "fear_level": user_profile.fear_level.name,
            "fear_level_description" : user_profile.fear_level.description,
            "profile_tags": [tag.name for tag in user_profile.profile_tags.all()],
            "profile_tags_category": [tag.category for tag in user_profile.profile_tags.all()],
            "user_experience_total_count" : total_count ,
            "user_experience_count" : count
        }
        return Response(data, status=status.HTTP_200_OK)

class UserAchievementAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        user_achievements = UserAchievement.objects.filter(user=user)
        total_count = Achievement.objects.all().count()
        print(total_count)
        if not user_achievements.exists():
            return Response({"error": "No achievements found."}, status=404)

        data = {
            "user_achievements": [
                {
                    "emoji": ua.achieve.name[:1],
                    "name": ua.achieve.name[2:],
                    "earned_on": ua.date_earned.strftime('%b %d, %Y • %#I:%M %p'),  # formatted datetime
                    "user_total_achievement" : total_count
                }
                for ua in user_achievements
            ]
        }
        return Response(data, status=200)

class UserExperienceAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        user_experience = UserExperience.objects.filter(user=user)

        if not user_experience.exists():
            return Response({"error": "No experience found."}, status=404)

        data = {
            "user_experience": [
                {
                    "name": ua.experience.title,
                    "difficulty": ua.experience.difficulty,
                    "image": ua.experience.image.url,
                    "joined_at": ua.joined_at.strftime('%b %d, %Y • %#I:%M %p')  # formatted datetime
                }
                for ua in sorted(user_experience, key=lambda x: x.joined_at, reverse=True) if not ua.completed
            ]
        }
        return Response(data, status=200)
    


# class UserExperienceAPI(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, *args, **kwargs):
#         user = request.user
#         try:
#             user_achievement = UserAchievement.objects.get(user=user)
#         except (UserProfile.DoesNotExist, UserAchievement.DoesNotExist):
#             return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

#         data = {
#             "user_achievements_name" : [a.name[2:] for a in user_achievement.achieve.all()],
#             "user_achievements_emoji" : [a.name[:1] for a in user_achievement.achieve.all()],
#         }
#         return Response(data, status=status.HTTP_200_OK)
    

#---------------------TESTING-INSERTING-REWARDS--------------------#
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

# Inserting of Achievements
class AchievementsUploadView(APIView):
    permission_classes = [IsAdminUser]  # or use custom permission

    def post(self, request):
        member = request.data.get("achievements",[])
        created = []
        for fear in member:
            obj, _ = Achievement.objects.get_or_create(
                name=fear.get('name'),
                description=fear.get('description')
            )
            created.append({'name': obj.name, 'description': obj.description})
        return Response({"created_tags": created}, status=status.HTTP_201_CREATED)