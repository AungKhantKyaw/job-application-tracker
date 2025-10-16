
from django.db import models
from django.utils import timezone

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('phone_screen', 'Phone Screen'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    location = models.CharField(max_length=200, blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    job_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    applied_date = models.DateField(default=timezone.now)
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_date']
    
    def __str__(self):
        return f"{self.position} at {self.company}"