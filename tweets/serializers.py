
from rest_framework import serializers
from .models import *
from user.serializers import UserProfileSerializer
from datetime import datetime
from django.utils import timezone, timesince

class TweetSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField()
    post_duration = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    
    def get_user_profile(self, obj):
        return UserProfileSerializer(obj.user).data
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_post_duration(self, obj):
        try:
            time_difference = timezone.now() - obj.timestamp

            # Convert the time difference to a readable format
            days = time_difference.days
            hours, remainder = divmod(time_difference.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)

            if days > 0:
                return f"{days}d ago"
            elif hours > 0:
                return f"{hours}h ago"
            elif minutes > 0:
                return f"{minutes}m ago"
            else:
                return "Just now"
        except Exception as e:
            print("err", str(e))
            
    class Meta:
        model = Tweet
        fields = ("content", "user_profile", "post_duration", "like_count")