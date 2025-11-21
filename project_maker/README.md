# Project Maker 🚀

A Django-based web application for managing user projects, experiences, and achievements with a built-in gamification and reward system.

![Django](https://img.shields.io/badge/Django-5.2-green?style=flat-square&logo=django)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)

## 🌟 Features

- **User Authentication** - Secure JWT-based authentication with token rotation
- **Social Networking** - Friend requests and connection management
- **Project Marketplace** - Browse and purchase various project types (Web, App, Game, 3D Models)
- **Experience Courses** - Enroll in learning experiences with automatic progress tracking
- **Achievement System** - Earn badges and achievements as you complete experiences
- **Gamification** - Fear levels for progression tracking and membership tiers
- **User Profiles** - Customizable profiles with tags and profile information
- **Feedback System** - Built-in contact and feedback management
- **REST API** - Full REST API with comprehensive endpoints
- **Admin Dashboard** - Django admin panel for system management
- **Docker Support** - Ready for containerized deployment
- **CORS Enabled** - Frontend integration ready

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment support (venv)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_maker
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Apply database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (admin account)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

## ▶️ Running the Project

### Development Server

```bash
python manage.py runserver
```

Access the application at: `http://127.0.0.1:8000/`

Admin panel: `http://127.0.0.1:8000/admin/`

### Production Server (Gunicorn)

```bash
gunicorn project_maker.wsgi:application --bind 0.0.0.0:8000
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t project-maker .

# Run the container
docker run -p 8000:8000 project-maker
```

## 📁 Project Structure

```
project_maker/
├── manage.py                      # Django management script
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Docker configuration
├── README.md                      # This file
├── DETAILS.txt                    # Detailed documentation
├── db.sqlite3                     # SQLite database
├── project_maker/                 # Main project settings
│   ├── settings.py               # Configuration
│   ├── urls.py                   # URL routing
│   ├── wsgi.py                   # WSGI config
│   └── asgi.py                   # ASGI config
├── auths/                        # Authentication & Social
│   ├── models.py                 # FriendRequest model
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── projects/                     # Project Management
│   ├── models.py                 # Project model
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── dashboard/                    # User Dashboard & Rewards
│   ├── models.py                 # User profile, achievements, experience
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── feedback/                     # Feedback System
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── control/                      # Admin Control
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
└── media/                        # User uploaded files
    ├── experience_images/
    └── project_images/
```

## 🔌 API Documentation

### Base URL
```
http://127.0.0.1:8000/
```

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `/auth/` | Authentication endpoints (login, register, friend requests) |
| `/projects/` | Project listing, creation, and management |
| `/dashboard/` | User profile, achievements, progress |
| `/feedback/` | Feedback and contact forms |
| `/control/` | Admin control endpoints |
| `/admin/` | Django admin panel |

### Authentication

All API endpoints require JWT authentication in the header:

```
Authorization: Bearer <your_jwt_token>
```

## 💾 Database Models

### Apps and Their Models

#### **1. Auths (Authentication & Social)**
- `FriendRequest` - Manage friend connections

#### **2. Projects (Project Management)**
- `Project` - Projects for marketplace

#### **3. Dashboard (Rewards & Progression)**
- `Achievement` - Badge definitions
- `UserAchievement` - User earned badges
- `UserTag` - User categorization
- `FearLevel` - User progression levels
- `MemberShip` - Membership tiers
- `Experience` - Learning courses
- `UserExperience` - User enrollments
- `Booking` - Project purchases/reservations
- `Progress` - User progress statistics
- `UserProfile` - Extended user information

#### **4. Feedback (Contact System)**
- `Feedback` - User feedback submissions

#### **5. Control (Admin)**
- Administrative models

## 🔐 Authentication

### JWT (JSON Web Token)

The project uses Django REST Framework's JWT authentication (`djangorestframework_simplejwt`).

**Token Settings:**
- Access token lifetime: 60 minutes
- Refresh token lifetime: 7 days
- Token rotation enabled
- Blacklist after rotation enabled

**Getting a Token:**
```bash
curl -X POST http://127.0.0.1:8000/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

**Using the Token:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://127.0.0.1:8000/api/endpoint/
```

## 🐳 Deployment

### Docker

The project includes a `Dockerfile` for containerized deployment.

**Build and Run:**
```bash
docker build -t project-maker .
docker run -p 8000:8000 project-maker
```

### Environment Variables

For production deployment, set these environment variables:

```bash
SECRET_KEY=your-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ORIGIN_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### Production Checklist

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS` with actual domains
- [ ] Set `CORS_ORIGIN_ALLOW_ALL = False` and configure specific origins
- [ ] Migrate database to PostgreSQL or MySQL
- [ ] Set up email backend for notifications
- [ ] Configure media file storage (AWS S3 recommended)
- [ ] Set up SSL/HTTPS
- [ ] Configure CDN for static files
- [ ] Set up logging and monitoring
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline
- [ ] Implement rate limiting

## 📦 Requirements

```
Django==5.2
djangorestframework==3.16.0
djangorestframework-simplejwt==5.5.0
django-cors-headers==4.7.0
Pillow==11.2.1
gunicorn==22.0.0
whitenoise==6.6.0
```

See `requirements.txt` for complete list with versions.

## 🔧 Development

### Making Migrations

After modifying models, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Running Tests

```bash
python manage.py test
```

### Django Shell

```bash
python manage.py shell
```

### Create Superuser

```bash
python manage.py createsuperuser
```

### Collect Static Files

```bash
python manage.py collectstatic --noinput
```

## 📚 User Workflow

1. **User Registration** → UserProfile created automatically
2. **Browse Projects/Experiences** → Filter by type, price, difficulty
3. **Send Friend Requests** → Build social network
4. **Book/Purchase Experience** → Enrollment created with auto end-date
5. **Complete Experience** → Auto-marked completed when end-date reached
6. **Earn Achievements** → Unlocked upon completion
7. **Track Progress** → View achievements and experience history
8. **Upgrade Membership** → Access premium perks and features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## 📞 Contact

- **Author**: Project Maker Team
- **Email**: support@projectmaker.com
- **GitHub**: [Your GitHub Profile]

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- API framework: [Django REST Framework](https://www.django-rest-framework.org/)
- Authentication: [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- CORS support: [django-cors-headers](https://github.com/adamchainz/django-cors-headers)

---

**Last Updated:** November 16, 2025

**Status:** In Development

**Version:** 1.0.0

Made with ❤️ by Project Maker Team
