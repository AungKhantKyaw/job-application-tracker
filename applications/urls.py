from django.urls import path
from . import views

urlpatterns = [
    path('', views.ApplicationListView.as_view(), name='application-list'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('new/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('<int:pk>/edit/', views.ApplicationUpdateView.as_view(), name='application-update'),
    path('<int:pk>/delete/', views.ApplicationDeleteView.as_view(), name='application-delete'),
]
