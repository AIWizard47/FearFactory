from django.urls import path
from .views import Projects
urlpatterns = [
    path("project/",Projects.as_view(),name="project"),
]
