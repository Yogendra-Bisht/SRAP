# 🏠 Room & Accommodation Booking Platform

A full-stack web application built using **Supabase** and **PostgreSQL** that allows room owners to list accommodations and students/users to browse, compare, and book rooms online.

This project demonstrates real-world backend concepts like authentication, database design, security policies, and file storage using a modern Backend-as-a-Service approach.

---

## 🚀 Features

### 🔐 Authentication
- Email & password authentication
- Secure session handling
- Protected routes

### 🏘️ Room Management
- Room owners can add, update, and delete rooms
- Upload room images using Supabase Storage
- Store room features (WiFi, AC, etc.) using JSON

### 📅 Booking System
- Users can book available rooms
- Prevents double booking using constraints & logic
- View booking history

### 🔒 Security (RLS)
- Row Level Security enabled
- Users can only access their own data
- Secure database-level authorization

### ⚡ Realtime Updates
- Live booking updates using Supabase Realtime

---

## 🛠️ Tech Stack

### Frontend
- JavaScript / React / Next.js
- Supabase JavaScript Client

### Backend
- Supabase
- PostgreSQL

### Database Features Used
- Relational schema
- Foreign keys & constraints
- Indexes for performance
- JSON / JSONB columns
- SQL joins & aggregations
- Functions & triggers (basic)

---

## 🗄️ Database Schema (High Level)

### Tables
- `users` – authenticated users
- `rooms` – room listings
- `bookings` – booking records

### Relationships
- One user → many rooms
- One room → many bookings
- One user → many bookings

---

## 🔐 Security Implementation
- Row Level Security (RLS) enabled on all tables
- Policies using `auth.uid()`
- Public & private storage buckets
- Server-side validation via PostgreSQL constraints

---

## 📦 Supabase Features Used
- Authentication
- PostgreSQL Database
- Storage Buckets
- Realtime Subscriptions
- SQL Editor
- Row Level Security (RLS)

---

## 📂 Project Structure
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ └── supabaseClient.js
├── database/
│ ├── schema.sql
│ └── policies.sql
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/room-booking-platform.git
cd room-booking-platform

2️⃣ Create Supabase Project

Go to Supabase Dashboard

Create a new project

3️⃣ Configure Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Install Dependencies
npm install
5️⃣ Run the App
npm run dev


🎯 Learning Outcomes

Practical PostgreSQL usage

SQL queries & joins

Database schema design

Backend security with RLS

Real-time data handling

Full-stack project structure

Copy Project URL and Anon Key

📌 Future Improvements

Payment integration

Admin dashboard

Search & filters

Notification system

Review & rating system
🙌 Author

Yogendra Bisht
MCA Student | Full-Stack Developer
Focused on modern web technologies and backend systems

⭐ If you like this project

Don’t forget to star the repository ⭐


---

### 🔥 Pro Tip
When you push this to GitHub:
- Add **screenshots**
- Pin this repo to your profile
- Mention **PostgreSQL + RLS** in interviews (big plus)

If you want, I can:
- Customize this README for **Next.js specifically**
- Make a **resume bullet** from this project
- Create a **DB schema diagram**
- Or make a **short project explanation for interviews**

Just tell me 😄🚀
