# 🧟 FearFactory

**FearFactory** is an immersive, gamified horror-themed web application designed to deliver spooky challenges, terrifying experiences, and unique achievements. Built with Django and a dark aesthetic, this platform offers a thrilling mix of projects, hackathons, and events that push users to confront their fears while tracking their progress.

---

## 👻 Features

- 🔐 **JWT Authentication** – Secure login/logout using access and refresh tokens stored in cookies.
- 🧑‍💻 **User Dashboard** – Personalized dashboard showing achievements, experiences, fear level, and progress bars.
- 🎮 **Dynamic Experiences** – Automatically converts selected projects, events, or hackathons into user-specific experiences.
- 🏆 **Achievement System** – Users unlock achievements with badges, emojis, and timestamps as they progress.
- 📊 **Fear Level Tracker** – Users grow from beginners to horror masters through tracked levels and categories.
- 🧩 **Category-Based Experience** – Experiences categorized and sortable by difficulty, popularity, and user engagement.
- 🎭 **Dark Horror UI** – Modern, sleek, red-black themed design built with Tailwind CSS.

---

## 🧱 Tech Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** HTML, CSS (Tailwind), Vanilla JavaScript
- **Authentication:** JWT (access & refresh tokens)
- **Database:** SQLite / PostgreSQL

---

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- Django
- virtualenv (optional but recommended)

### Installation

```bash
git clone https://github.com/your-username/FearFactory.git
cd FearFactory
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
