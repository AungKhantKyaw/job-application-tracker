# 📋 Job Application Tracker

A full-stack **Job Application Tracker** built with **Django (backend)** and **React + Vite + TailwindCSS (frontend)**.  
Easily organize, monitor, and manage your job applications — keep track of company names, positions, statuses, and key dates — all in one place.

---

## ✨ Features

✅ **Frontend (React + Vite + TailwindCSS)**  
- Clean, responsive UI built with TailwindCSS  
- Real-time application list with API integration  
- **Filter by Status** (All, Applied, Phone Screen, Interview, Offer, Rejected, Withdrawn)  
- **Application Detail View** for deeper insight  
- Smooth navigation using React Router  

✅ **Backend (Django REST Framework)**  
- RESTful API for managing applications  
- Admin panel for quick CRUD operations  
- PostgreSQL support (configurable)  
- CORS enabled for frontend integration  

✅ **Docker Support**  
- One-command startup with Docker Compose  
- Separate services for React and Django  

---

## 🚀 Quick Start

### 🧰 Prerequisites
- Python
- Node.js
- Docker & Docker Compose (optional but recommended)
- Git

---

### 🖥️ Local Development (without Docker)

#### 1. Clone the repository
```bash
git clone https://github.com/AungKhantKyaw/job-application-tracker.git
cd job-application-tracker
```

#### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend API runs at **http://127.0.0.1:8001**

#### 3. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5175**

---

### 🐳 Using Docker (Recommended)

1. Build and start both services:
   ```bash
   docker-compose up --build
   ```

2. Access the apps:
   - Frontend: **http://localhost:5175**
   - Backend (API): **http://127.0.0.1:8001/api/applications/**

3. Stop the containers:
   ```bash
   docker-compose down
   ```

---

## 📖 Usage

### 🧩 Adding a New Application
1. Go to Django Admin (`/admin`)
2. Click **Applications**
3. Add details:
   - Company name
   - Position
   - Status (Applied, Interview, etc.)
   - Location, Salary, Notes, Dates

### 🗂 Viewing Applications
- **All Applications**: Default list view  
- **Filter by Status**: Choose from buttons (All, Applied, Offer, etc.)  
- **View Details**: Click a card to see full details

### ✏️ Editing & Deleting
- Manage directly through Django Admin

---

## 🗂️ Project Structure

```
job-application-tracker/
├── backend/
│   ├── applications/
│   │   ├── models.py           # Application model
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py             # API endpoints
│   └── job_tracker/
│       ├── settings.py         # Django settings
│       ├── urls.py             # Main URL configuration
│       ├── wsgi.py / asgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationList.jsx
│   │   │   ├── ApplicationDetail.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
├── Dockerfile (for both Django & React)
└── README.md
```

---

## 🧠 Tech Stack

| Layer          | Technology                              |
|----------------|------------------------------------------|
| Frontend       | React, Vite, TailwindCSS             |
| Backend        | Django, Django REST Framework           |
| Database       | SQLite                     |
| Containerization | Docker, Docker Compose                |

---

## 🔧 Environment Variables

Create `.env` files as needed:

**Backend (.env)**
```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5175
```

**Frontend (.env)**
```
VITE_API_URL=http://127.0.0.1:8001/api/
```
