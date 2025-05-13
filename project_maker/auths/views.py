from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import FriendRequest
from dashboard.models import UserProfile, FearLevel, MemberShip, UserTag, UserAchievement, Progress
from rest_framework_simplejwt.tokens import RefreshToken

class HelloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Hello, authenticated user!", "User": request.user.username})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(APIView):
    permission_classes = [AllowAny]  # allow signup without authentication

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)  # Hash password
        )

        # Get single instances for fear_level and membership
        fear_level = FearLevel.objects.get(name="Beginner")
        membership = MemberShip.objects.get(name="Free Haunter")

        #This is used to create the UserProfile
        UserProfile.objects.create(
            user=user,
            fear_level=fear_level,
            membership=membership
        )
        UserAchievement.objects.create(
            user=user
        )
        Progress.objects.create(
            user=user,
            experiences_completed = 0,
            achievements_unlocked = 0
        )

        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)



# class FollowUserView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, user_id):
#         to_user = User.objects.get(pk=user_id)
#         serializer = FriendshipSerializer(data={"to_user": to_user.id}, context={"request": request})
#         if serializer.is_valid():
#             serializer.save(from_user=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UnfollowUserView(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, user_id):
#         try:
#             friendship = Friendship.objects.get(from_user=request.user, to_user_id=user_id)
#             friendship.delete()
#             return Response({"detail": "Unfollowed successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Friendship.DoesNotExist:
#             return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)


class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_id = request.data.get("request_id")
        try:
            fr = FriendRequest.objects.get(id=request_id, to_user=request.user)
            fr.status = "accepted"
            fr.save()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({"error": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get usernames of accepted friends (sent or received)
        sent = FriendRequest.objects.filter(from_user=user, status='accepted').values_list('to_user__username', flat=True)
        received = FriendRequest.objects.filter(to_user=user, status='accepted').values_list('from_user__username', flat=True)
        friend_usernames = set(sent).union(set(received))

        data = []

        for username in friend_usernames:
            try:
                friend_user = User.objects.get(username=username)
                user_achievements = UserAchievement.objects.filter(user=friend_user).first()
                achievement_count = user_achievements.achieve.count() if user_achievements else 0
                
                data.append({
                    "name": friend_user.username,
                    "number_of_achievements": achievement_count
                })
                print(user_achievements)
            except User.DoesNotExist:
                continue
            except UserAchievement.DoesNotExist:
                data.append({
                    "name": username,
                    "number_of_achievements": 0
                })
        return Response({"friends": data}, status=status.HTTP_200_OK)
    
    

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        to_username = request.data.get("to_user")
        try:
            to_user = User.objects.get(username=to_username)
            if to_user == request.user:
                return Response({"error": "You cannot send a request to yourself."}, status=400)
            
            fr, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user)
            if not created:
                return Response({"message": f"Friend request already {fr.status}."}, status=200)

            return Response({"message": "Friend request sent."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
