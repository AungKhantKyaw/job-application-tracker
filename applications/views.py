from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import JobApplication
from .forms import JobApplicationForm

class ApplicationListView(ListView):
    model = JobApplication
    template_name = 'applications/application_list.html'
    context_object_name = 'applications'
    paginate_by = 10
    
    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.GET.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs
    
    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['status_choices'] = JobApplication.STATUS_CHOICES
        ctx['current_status'] = self.request.GET.get('status', '')
        return ctx

class ApplicationDetailView(DetailView):
    model = JobApplication
    template_name = 'applications/application_detail.html'
    context_object_name = 'application'

class ApplicationCreateView(CreateView):
    model = JobApplication
    form_class = JobApplicationForm
    template_name = 'applications/application_form.html'
    success_url = reverse_lazy('application-list')

class ApplicationUpdateView(UpdateView):
    model = JobApplication
    form_class = JobApplicationForm
    template_name = 'applications/application_form.html'
    success_url = reverse_lazy('application-list')

class ApplicationDeleteView(DeleteView):
    model = JobApplication
    template_name = 'applications/application_confirm_delete.html'
    success_url = reverse_lazy('application-list')