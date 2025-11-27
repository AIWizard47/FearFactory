from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import FriendRequest ,Friend
from dashboard.models import UserProfile, FearLevel, MemberShip, UserTag, UserAchievement, Progress
from rest_framework_simplejwt.tokens import RefreshToken
from .pagination import UserCursorPagination, FriendRequestCursorPagination, UserSearchCursorPagination
from django.db.models import Q, Prefetch

class CheckAuth(APIView):
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
        Progress.objects.create(
            user=user,
            experiences_completed = 0,
            achievements_unlocked = 0
        )
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)


#---------------- View Users -----------------#
class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = UserProfile.objects.all()
        data = []
        for profile in profiles:
            user = profile.user
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "fear_level": profile.fear_level.name,
                "membership": profile.membership.name,
            })

        return Response(data, status=status.HTTP_200_OK)

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
                


#----------------- Friend Request Views -----------------#
class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_id = request.data.get("request_id")

        if not request_id:
            return Response({"error": "request_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fr = FriendRequest.objects.get(
                id=request_id,
                to_user=request.user,      # ONLY the receiver can accept
                status="pending"           # MUST be pending
            )
        except FriendRequest.DoesNotExist:
            return Response(
                {"error": "Friend request not found or already processed."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create mutual friendship
        Friend.objects.create(user=fr.from_user, friend=fr.to_user)
        Friend.objects.create(user=fr.to_user, friend=fr.from_user)
        
        # Mark as accepted
        fr.status = "accepted"
        fr.save()

        return Response({"message": "Friend request accepted successfully."}, status=status.HTTP_200_OK)


class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_id = request.data.get("request_id")

        if not request_id:
            return Response({"error": "request_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fr = FriendRequest.objects.get(
                id=request_id,
                to_user=request.user,      # ONLY the receiver can reject
                status="pending"           # MUST be pending
            )
        except FriendRequest.DoesNotExist:
            return Response(
                {"error": "Friend request not found or already processed."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark as accepted
        fr.status = "rejected"
        fr.save()

        return Response({"message": "Friend request rejected successfully."}, status=status.HTTP_200_OK)
    
    

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            sent = FriendRequest.objects.filter(
                from_user=user, status='accepted'
            ).values_list('to_user__id', flat=True)

            received = FriendRequest.objects.filter(
                to_user=user, status='accepted'
            ).values_list('from_user__id', flat=True)

            friend_ids = list(set(sent).union(set(received)))

            friends = User.objects.filter(id__in=friend_ids).order_by('-date_joined')

            paginator = UserCursorPagination()
            result_page = paginator.paginate_queryset(friends, request)

            data = []

            for friend_user in result_page:
                try:
                    req = (
                        FriendRequest.objects.filter(
                            from_user=user, to_user=friend_user, status="accepted"
                        ).first()
                        or
                        FriendRequest.objects.filter(
                            from_user=friend_user, to_user=user, status="accepted"
                        ).first()
                    )

                    achievement_count = UserAchievement.objects.filter(user=friend_user).count()

                    data.append({
                        "id": friend_user.id,
                        "name": friend_user.username,
                        "number_of_achievements": achievement_count,
                        
                    })

                except Exception as e:
                    data.append({
                        "id": friend_user.id,
                        "name": friend_user.username,
                        "error": "Could not load friend record",
                        "debug_error": str(e)
                    })

            return paginator.get_paginated_response(data)

        except Exception as e:
            return Response(
                {
                    "error": "Failed to load friends",
                    "debug_error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
class FriendPendingSendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            pending_sent = FriendRequest.objects.filter(
                from_user=user,
                status='pending'
            ).order_by('-created_at')

            paginator =  FriendRequestCursorPagination()
            result_page = paginator.paginate_queryset(pending_sent, request)

            data = []

            for req in result_page:
                try:
                    data.append({
                        "id": req.to_user.id,
                        "name": req.to_user.username,
                        "created_at": req.created_at,
                    })
                except Exception as inner_err:
                    # Skip only faulty item, do NOT break whole API
                    continue

            return paginator.get_paginated_response(data)

        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching sent requests."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FriendPendingReceiveListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            pending_received = FriendRequest.objects.filter(
                to_user=user,
                status='pending'
            ).order_by('-created_at')

            paginator =  FriendRequestCursorPagination()
            result_page = paginator.paginate_queryset(pending_received, request)

            data = []

            for req in result_page:
                try:
                    data.append({
                        "id": req.from_user.id,
                        "request_id": req.id,
                        "name": req.from_user.username,
                        "created_at": req.created_at,
                    })
                except Exception:
                    continue

            return paginator.get_paginated_response(data)

        except Exception:
            return Response(
                {"error": "Something went wrong while fetching received requests."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        to_user_id = request.data.get("to_user_id")

        if not to_user_id:
            return Response({"error": "to_user is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Cannot send friend request to yourself
        if to_user == request.user:
            return Response({"error": "You cannot send a friend request to yourself."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if already friends
        if Friend.objects.filter(user=request.user, friend=to_user).exists():
            return Response({"message": "You are already friends."}, status=status.HTTP_200_OK)

        # Check if a pending request already exists
        existing_request = FriendRequest.objects.filter(
            from_user=request.user,
            to_user=to_user,
            status="pending"
        ).first()

        if existing_request:
            return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if that user already sent you a request (reverse)
        reverse_request = FriendRequest.objects.filter(
            from_user=to_user,
            to_user=request.user,
            status="pending"
        ).first()

        if reverse_request:
            return Response({
                "message": "That user already sent you a request.",
                "request_id": reverse_request.id
            }, status=status.HTTP_200_OK)

        # Create friend request
        fr = FriendRequest.objects.create(
            from_user=request.user,
            to_user=to_user
        )

        return Response({"message": "Friend request sent!", "request_id": fr.id }, status=status.HTTP_201_CREATED)
    
    
class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")
        fear = request.GET.get("fearlevel", "")
        tag = request.GET.get("tag", "")
        ach = request.GET.get("achievement", "")
        membership = request.GET.get("membership", "")

        # Prefetch user achievements properly
        user_achievements_prefetch = Prefetch(
            "user__userachievement_set",
            queryset=UserAchievement.objects.select_related("achieve"),
            to_attr="prefetched_achievements"
        )

        # Base query
        users = UserProfile.objects.select_related(
            "user",
            "fear_level",
            "membership"
        ).prefetch_related(
            "profile_tags",
            user_achievements_prefetch
        )
        
        # 🚫 Exclude the logged-in user
        users = users.exclude(user=request.user)

        # 🔍 Filters
        if query:
            users = users.filter(
                Q(user__username__icontains=query) |
                Q(fear_level__name__icontains=query) |
                Q(profile_tags__name__icontains=query)
            ).distinct()

        if fear:
            users = users.filter(fear_level__name__icontains=fear)

        if membership:
            users = users.filter(membership__name__icontains=membership)

        if tag:
            users = users.filter(profile_tags__name__icontains=tag)

        if ach:
            users = users.filter(
                user__userachievement_set__achieve__name__icontains=ach
            ).distinct()

        # Cursor Pagination
        paginator = UserSearchCursorPagination()
        page = paginator.paginate_queryset(users, request)

        results = []

        for u in page:
            achievement_names = []
            if hasattr(u.user, "prefetched_achievements"):
                achievement_names = [
                    ua.achieve.name
                    for ua in u.user.prefetched_achievements
                ]

            results.append({
                "id": u.user.id,
                "username": u.user.username,
                "fear_level": u.fear_level.name if u.fear_level else None,
                "membership": u.membership.name if u.membership else None,
                "tags": [t.name for t in u.profile_tags.all()],
                "achievements": achievement_names,
                "profile_pic": u.profile_pic.url if u.profile_pic else None,
            })

        return paginator.get_paginated_response(results)
