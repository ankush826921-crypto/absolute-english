# Absolute English

> A modern coaching institute website and management platform built for Absolute English.

## 📌 About the Project

**Absolute English** is a Django-based web application developed for an English coaching institute.

The platform is designed to provide information about courses, faculty, student testimonials, gallery, enquiries and other institute-related services.

The project is developed using:

* HTML
* CSS
* JavaScript
* Django
* SQLite (Development Database)

---

## 🎯 Project Goals

The main goals of Absolute English are:

* Create a professional coaching institute website
* Display available English programs
* Manage program information
* Display faculty profiles
* Display student testimonials
* Manage institute gallery
* Allow students to submit enquiries
* Provide demo/class booking functionality
* Provide an AI chatbot/student assistant
* Provide authentication for authorized users
* Provide an admin/management system
* Keep the project scalable and easy for the development team to maintain

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Django

### Database

* SQLite for development
* PostgreSQL can be used for production

### Version Control

* Git
* GitHub

---

## 📂 Project Structure

```text
absolute-english/
│
├── manage.py
├── README.md
├── requirements.txt
├── .gitignore
├── LICENSE
│
├── absolute_english/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   │
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── accounts/
│   │   ├── static/
│   │   │   └── accounts/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   ├── programs/
│   ├── faculty/
│   ├── testimonials/
│   ├── gallery/
│   ├── enquiries/
│   └── chatbot/
│
├── media/
│
├── static/
│
├── templates/
│
├── docs/
│
├── scripts/
│
├── tests/
│
└── .github/
```

---

## 📦 Applications

### Accounts

Handles:

* Login
* Registration
* User profile
* Authentication
* Permissions

### Programs

Handles:

* English courses
* Program details
* Course duration
* Fees
* Batches
* Learning outcomes

### Faculty

Handles:

* Teacher profiles
* Faculty information
* Qualifications
* Experience
* Profile photos

### Testimonials

Handles:

* Student reviews
* Student feedback
* Success stories

### Gallery

Handles:

* Class photographs
* Events
* Institute activities
* Gallery management

### Enquiries

Handles:

* Student enquiries
* Contact forms
* Demo class requests
* Enquiry management

### Chatbot

Handles:

* Student questions
* Institute information
* Program-related queries
* Basic student assistance

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Enter the project

```bash
cd absolute-english
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create superuser

```bash
python manage.py createsuperuser
```

### 6. Check the project

```bash
python manage.py check
```

### 7. Start development server

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

Admin:

```text
http://127.0.0.1:8000/admin/
```

---

## 🔗 Main Routes

| Route                 | Purpose      |
| --------------------- | ------------ |
| `/`                   | Home         |
| `/admin/`             | Django Admin |
| `/accounts/`          | Accounts     |
| `/accounts/login/`    | Login        |
| `/accounts/register/` | Registration |
| `/accounts/profile/`  | Profile      |
| `/programs/`          | Programs     |
| `/faculty/`           | Faculty      |
| `/testimonials/`      | Testimonials |
| `/gallery/`           | Gallery      |
| `/enquiries/`         | Enquiries    |
| `/chatbot/`           | Chatbot      |

---

## 👥 Development Team

The project follows a team-based Git workflow.

### Recommended workflow

```text
main
 │
 ├── feature/accounts
 ├── feature/programs
 ├── feature/faculty
 ├── feature/gallery
 ├── feature/enquiries
 └── feature/chatbot
```

Developers should work on their assigned feature branch and create a Pull Request before merging into `main`.

---

## 📌 Development Rules

1. Do not directly push unfinished code to `main`.
2. Create a separate branch for every feature.
3. Keep commits small and meaningful.
4. Test the project before creating a Pull Request.
5. Do not commit passwords, API keys or secret credentials.
6. Do not modify another developer's feature without discussion.
7. Keep HTML, CSS and JavaScript inside the relevant Django app.
8. Keep reusable code organized and documented.
9. Pull the latest `main` before starting new work.
10. Every Pull Request should be reviewed before merging.

---

## 🧪 Testing

Run:

```bash
python manage.py check
```

For tests:

```bash
python manage.py test
```

---

## 👨‍💻 Project Lead

**Project:** Absolute English

**Backend:** Django

**Frontend:** HTML, CSS, JavaScript

**Database:** SQLite (Development)

---

## 📄 License

This project is developed for the Absolute English coaching institute project.
