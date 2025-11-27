from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Project
from dashboard.models import UserProfile
from .pagination import ProjectCursorPagination


class Projects(APIView):
    permission_classes = [IsAuthenticated]

    pagination_class = ProjectCursorPagination()

    def get(self, request, *args, **kwargs):
        paginator = self.pagination_class
        projects_page = paginator.paginate_queryset(Project.objects.all().order_by("-id"), request)

        serialized = []
        for project in projects_page:
            profile = UserProfile.objects.filter(user=project.user).select_related("fear_level").first()

            serialized.append({
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "project_type": project.get_project_type_display(),
                "price": str(project.price),
                "launch_date": project.launch_date,
                "is_premium": project.is_premium,
                "template_available": project.template_available,
                "achievement_tags": project.achievement_tags.split(",") if project.achievement_tags else [],
                "user_tags": project.user_tags.split(",") if project.user_tags else [],
                "image_url": project.image.url if project.image else None,
                "fearLevel": profile.fear_level.name if profile and profile.fear_level else None,
            })

        return paginator.get_paginated_response(serialized)
