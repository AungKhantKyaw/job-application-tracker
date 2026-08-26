from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import JobApplication, StatusHistory
from django.urls import path
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.db.models import Q
import json

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

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('kanban/', self.admin_site.admin_view(self.kanban_view), name='applications_jobapplication_kanban'),
            path('kanban/update-status/', self.admin_site.admin_view(self.update_status_view), name='applications_jobapplication_update_status'),
        ]
        return custom_urls + urls

    def kanban_view(self, request):
        applications = JobApplication.objects.all().order_by('-applied_date')
        
        # Admin Search compatibility
        search_query = request.GET.get('q', '').strip()
        if search_query:
            applications = applications.filter(
                Q(company__icontains=search_query) |
                Q(position__icontains=search_query) |
                Q(location__icontains=search_query)
            )

        # Define columns and map applications
        columns = [
            {
                'id': 'applied',
                'title': 'Applied',
                'default_status': 'applied',
                'badge_color': 'bg-blue-500',
                'apps': [app for app in applications if app.status == 'applied']
            },
            {
                'id': 'screening',
                'title': 'Screening',
                'default_status': 'phone_screen',
                'badge_color': 'bg-amber-500',
                'apps': [app for app in applications if app.status in ('phone_screen', 'coding_test')]
            },
            {
                'id': 'interviews',
                'title': 'Interviews',
                'default_status': 'interview',
                'badge_color': 'bg-emerald-500',
                'apps': [app for app in applications if app.status in ('interview', 'second_interview')]
            },
            {
                'id': 'offered',
                'title': 'Offered',
                'default_status': 'offered',
                'badge_color': 'bg-green-600',
                'apps': [app for app in applications if app.status == 'offered']
            },
            {
                'id': 'closed',
                'title': 'Closed',
                'default_status': 'rejected',
                'badge_color': 'bg-red-500',
                'apps': [app for app in applications if app.status in ('rejected', 'withdrawn')]
            },
        ]

        context = {
            **self.admin_site.each_context(request),
            'title': 'Job Application Kanban Board',
            'columns': columns,
            'search_query': search_query,
            'opts': self.model._meta,
        }
        return render(request, 'admin/applications/jobapplication/kanban.html', context)

    @method_decorator(csrf_protect)
    def update_status_view(self, request):
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method'}, status=400)

        try:
            data = json.loads(request.body)
            app_id = data.get('id')
            new_status = data.get('status')

            if not app_id or not new_status:
                return JsonResponse({'error': 'Missing parameters'}, status=400)

            app = JobApplication.objects.get(pk=app_id)
            app.status = new_status
            app.save()
            return JsonResponse({'success': True, 'new_status': app.status})
        except JobApplication.DoesNotExist:
            return JsonResponse({'error': 'Application not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)