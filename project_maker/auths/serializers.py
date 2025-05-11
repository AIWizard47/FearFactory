from rest_framework import serializers
from .models import Friendship
from django.contrib.auth.models import User

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'from_user', 'to_user', 'created_at']
        read_only_fields = ['from_user', 'created_at']

    def validate_to_user(self, value):
        user = self.context['request'].user
        if user == value:
            raise serializers.ValidationError("You cannot follow yourself.")
        return value
