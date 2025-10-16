from rest_framework import serializers
from applications.models import JobApplication  # adjust name if needed

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"
