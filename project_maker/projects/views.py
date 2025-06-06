from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Project

class Projects(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        projects = Project.objects.all()
        if not projects.exists():
            return Response(
                {"error": "No projects found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prepare the serialized data
        data = {
            "projects": [
                {
                    "id": project.id,
                    "title": project.title,
                    "description": project.description,
                    "project_type": project.get_project_type_display(),
                    "price": str(project.price),
                    "launch_date": project.launch_date,
                    "is_premium": project.is_premium,
                    "template_available": project.template_available,
                    "achievement_tags": project.achievement_tags.split(',') if project.achievement_tags else [],
                    "user_tags": project.user_tags.split(',') if project.user_tags else [],
                    "image_url": project.image.url if project.image else None,
                }
                for project in projects     
            ]
        }

        return Response(data, status=status.HTTP_200_OK)
