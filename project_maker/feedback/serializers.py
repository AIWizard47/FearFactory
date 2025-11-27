# import serializer from rest_framework 
from rest_framework import serializers
# import model from models.py
from .models import FeedbackAboutUs, FeedbackContactUs, ProjectReview

# Create a model serializer  
class FeedbackAboutUsSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = FeedbackAboutUs 
        fields = ['user_name', 'user_email', 'user_subject', 'user_message']
    
class FeedbackContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackContactUs
        fields = ['user_name', 'user_email', 'user_number', 'user_subject', 'user_message', 'user_subscribe']

class ProjectReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReview
        fields = ['project_id', 'user_name', 'user_email', 'rating', 'review_message']