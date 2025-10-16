# 📋 Job Application Tracker

A Django-based web application to help you organize and track your job applications in one place. Keep track of companies, positions, application status, and important dates with an intuitive interface.

## ✨ Features

- 

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AungKhantKyaw/job-application-tracker.git
   cd job-application-tracker
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

7. **Open your browser**
   
   Navigate to `http://127.0.0.1:8000/`

## 📖 Usage

### Adding a New Application

1. Click on **"+ Add New"** in the navigation bar
2. Fill in the application details:
   - Company name (required)
   - Position (required)
   - Status
   - Location
   - Salary range
   - Job URL
   - Description
   - Personal notes
   - Applied date
   - Follow-up date
3. Click **"Save"**

### Viewing Applications

- **All Applications**: View all your applications in a table format on the home page
- **Filter by Status**: Use the filter bar to view applications by specific status
- **View Details**: Click "View" next to any application to see full details

### Editing Applications

1. Click **"Edit"** next to an application in the list, or
2. View the application details and click the **"Edit"** button
3. Update the information and click **"Save"**

### Deleting Applications

1. View the application details
2. Click the **"Delete"** button
3. Confirm the deletion

## 🗂️ Project Structure

```
job-application-tracker/
├── job_tracker/              # Project configuration
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py              # WSGI configuration
│   └── asgi.py              # ASGI configuration
├── applications/             # Main application
│   ├── models.py            # Database models
│   ├── views.py             # View logic
│   ├── urls.py              # App URL patterns
│   ├── forms.py             # Form definitions
│   ├── admin.py             # Admin configuration
│   └── templates/           # HTML templates
│       └── applications/
│           ├── base.html
│           ├── application_list.html
│           ├── application_detail.html
│           ├── application_form.html
│           └── application_confirm_delete.html
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore file
└── README.md               # This file
```

