from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import JobApplication, StatusHistory

class StatusHistoryInline(admin.TabularInline):
    model = StatusHistory
    extra = 0
    readonly_fields = ['status', 'changed_at', 'notes']
    can_delete = False
    ordering = ['-changed_at']
    fields = ['status', 'notes', 'changed_at']

@admin.register(JobApplication)
class JobApplicationAdmin(ModelAdmin):
    list_display = ['company', 'position', 'status', 'applied_date', 'location']
    list_filter = ['status', 'applied_date']
    search_fields = ['company', 'position', 'location']
    date_hierarchy = 'applied_date'
    inlines = [StatusHistoryInline]