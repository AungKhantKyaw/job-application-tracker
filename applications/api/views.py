from rest_framework import viewsets, generics
from applications.models import JobApplication
from .serializers import JobApplicationSerializer, UserRegisterSerializer
from django.contrib.auth.models import User

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-id")
    serializer_class = JobApplicationSerializer

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer