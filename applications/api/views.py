from rest_framework import viewsets
from applications.models import JobApplication
from .serializers import JobApplicationSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-id")
    serializer_class = JobApplicationSerializer
