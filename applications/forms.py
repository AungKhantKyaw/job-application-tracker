from django import forms
from .models import JobApplication
from .widgets import QuillAdminWidget

class JobApplicationForm(forms.ModelForm):
    class Meta:
        model = JobApplication
        fields = ['company', 'position', 'status', 'location', 'salary_range', 
                  'job_url', 'description', 'notes', 'applied_date', 'follow_up_date']
        widgets = {
            'applied_date': forms.DateInput(attrs={'type': 'date'}),
            'follow_up_date': forms.DateInput(attrs={'type': 'date'}),
            'description': QuillAdminWidget(),
            'notes': QuillAdminWidget(),
        }