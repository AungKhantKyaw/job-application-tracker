from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('phone_screen', 'Phone Screen'),
        ('interview', 'Interview'),
        ('coding_test', 'Coding Test'),
        ('second_interview', 'Second Interview'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications"
    )

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
    
    def save(self, *args, **kwargs):
        # Check if this is a new instance or an existing one being updated
        if self.pk:
            old_status = JobApplication.objects.filter(pk=self.pk).values_list('status', flat=True).first()
            # If status changed, we'll create a history entry after the save
            status_changed = old_status is not None and old_status != self.status
        else:
            # New instance: we'll create an initial history entry after save
            status_changed = True
        
        super().save(*args, **kwargs)
        
        # Create history entry if status changed (or on creation)
        if status_changed:
            StatusHistory.objects.create(
                job_application=self,
                status=self.status,
                notes=f"Status changed to {self.get_status_display()}"
            )
    
    @property
    def status_history(self):
        """Return all status history entries for this application, ordered oldest first."""
        return self.history_entries.all().order_by('changed_at')


class StatusHistory(models.Model):
    job_application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name='history_entries'
    )
    status = models.CharField(max_length=20, choices=JobApplication.STATUS_CHOICES)
    changed_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, help_text="Optional note about this status change")
    
    class Meta:
        ordering = ['changed_at']
        verbose_name_plural = "Status histories"
    
    def __str__(self):
        return f"{self.job_application} - {self.get_status_display()} on {self.changed_at.date()}"