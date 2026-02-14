Student Room Accommodation Platform (SRAP)🏠
A Hyper-Local Housing & Resource Hub for Students

SRAP is a full-stack web application designed to simplify off-campus housing for students. It features a modern booking system for PGs/Rooms and a "Campus Guide" to help students locate essential services like hospitals and canteens near their residence.

🏗️ Project Structure
This repository is organized as a Monorepo:

Plaintext
/student-room-accommodation
├── /frontend       # Next.js 14+ (App Router), Tailwind CSS, Framer Motion
├── /backend        # Django REST Framework, PostgreSQL
├── /docs           # Project Synopsis and Design Diagrams
└── README.md       # Project Documentation
🛠️ Technology Stack
Frontend
Framework: Next.js 14 (React)

Styling: Tailwind CSS (Responsive Design)

Animations: Framer Motion

Icons: Lucide React

Backend
Framework: Django REST Framework (DRF)

Database: PostgreSQL (Primary) / Supabase (Emergency Backup)

Authentication: JWT (JSON Web Tokens)

🚀 Getting Started
Prerequisites
Node.js (v18+)

Python (v3.10+)

Git

1. Frontend Setup
Bash
cd frontend
npm install
npm run dev
The frontend will run at http://localhost:3000.

2. Backend Setup
Bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
The API will run at http://localhost:8000.

✨ Key Modules
Room Discovery: Advanced filtering by price, amenities, and gender.

Owner Dashboard: CRUD operations for property listings.

Campus Guide: Interactive local resource locator (Hospitals, Medical Stores, Canteens).

Responsive UI: Fully optimized for mobile and desktop views.

👥 The Team
Yogendra Singh - Frontend Lead (Next.js, UI/UX, Animations)

Vijay Singh Rawat - Backend Lead (Django, API Design, Database)

Course: MCA (Final Year)

Department: Computer Science and Engineering

📄 License
This project is for academic purposes as part of the MCA Final Year curriculum.
