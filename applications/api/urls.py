from django.urls import path, include
from rest_framework import routers
from .views import JobApplicationViewSet, UserRegisterView

router = routers.DefaultRouter()
router.register(r"applications", JobApplicationViewSet, basename="application")

urlpatterns = [
    path("", include(router.urls)),          # /api/applications/ endpoints
    path("register/", UserRegisterView.as_view(), name="user-register"),  # /api/register/
]
