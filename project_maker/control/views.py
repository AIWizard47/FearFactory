from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from projects.models import Project
from dashboard.models import Experience, UserExperience, UserProfile
from django.contrib.auth.models import User

class RegisterToExperience(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get("project_id")
        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the project
        project = get_object_or_404(Project, id=project_id)
        profile = UserProfile.objects.filter(user=project.user).select_related("fear_level").first()
        # Try to find or create the corresponding Experience
        experience, created = Experience.objects.get_or_create(
            title=project.title,
            defaults={
                "description": project.description,
                "price": project.price,
                "difficulty": profile.fear_level.name if profile and profile.fear_level else None,  # You can dynamically assign this if needed
                "image": project.image  # assuming your Project model has `image` field
            }
        )

        # Avoid duplicate UserExperience
        user = request.user
        if UserExperience.objects.filter(user=user, experience=experience).exists():
            return Response({"message": "Already registered for this experience."}, status=status.HTTP_200_OK)

        # Register user for the experience
        UserExperience.objects.create(user=user, experience=experience)

        return Response({
            "message": "Successfully registered for experience.",
            "experience_id": experience.id,
            "title": experience.title
        }, status=status.HTTP_201_CREATED)
