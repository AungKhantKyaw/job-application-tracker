from django.contrib.auth.models import User
from rest_framework import serializers
from applications.models import JobApplication, StatusHistory  # import StatusHistory

class StatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusHistory
        fields = ['id', 'status', 'changed_at', 'notes']


class JobApplicationSerializer(serializers.ModelSerializer):
    status_history = StatusHistorySerializer(many=True, read_only=True, source='history_entries')

    class Meta:
        model = JobApplication
        exclude = ["user"]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        return user