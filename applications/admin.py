from django.contrib import admin
from .models import JobApplication

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['company', 'position', 'status', 'applied_date', 'location']
    list_filter = ['status', 'applied_date']
    search_fields = ['company', 'position', 'location']
    date_hierarchy = 'applied_date'