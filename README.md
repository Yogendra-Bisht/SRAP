# 🏠 NEST - Student Room & Accommodation Portal (SRAP)

A modern full-stack student accommodation portal built using the **MERN Stack** (MongoDB, Express, Next.js, Node.js). NEST allows university students to discover verified off-campus housing, find compatible roommates, read local campus guides, and book accommodations directly from room owners.

This project demonstrates robust backend architecture, relational schema modeling with NoSQL, JWT-based security, API middleware protections, and responsive frontend UI components.

---

## 🚀 Key Features

### 🔐 Secure Authentication & Authorization
- JWT-based authentication with secure session handling.
- Secure password hashing using `bcryptjs`.
- Separate role-based access control for **Students** and **Landlords/Property Owners**.
- Custom auth middlewares for route protection.

### 🏘️ Room & Property Listings
- Comprehensive room listings detailing pricing, amenities (Wi-Fi, AC, Meals, etc.), room type, and gender preferences.
- Image uploads handled securely via Cloud storage using **Cloudinary**.
- Dynamic search and filter options by location, price, and category.

### 📅 Booking Management
- Direct room booking functionality for students.
- Multi-step validation to prevent double-booking.
- Landlord dashboard to manage incoming bookings (Approve, Reject, or Cancel).

### 🤝 Roommate Finder
- Custom lifestyle profiles for students (lifestyle habits, sleep schedule, cleanliness, budget, smoking/drinking preferences).
- Compatibility browsing for students to locate and connect with potential roommates.

### 📖 Campus Guides & Blogs
- Community hub with guides categorized by food/cafes, hospitals, pharmacies, study spots, and other student essentials.
- Interactive comment sections and likes to foster campus community engagement.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion (for smooth micro-animations and transitions)
- **API Client**: Axios

### Backend
- **Framework**: Node.js & Express.js
- **Database**: MongoDB Atlas & Mongoose ODM
- **Media Storage**: Cloudinary
- **Emails**: Resend API

---

## 🔐 Security & API Best Practices
- **Helmet**: Adds secure HTTP headers to prevent common vulnerabilities (XSS, clickjacking, etc.).
- **Express Rate Limiter**: Rate-limits API requests to prevent brute-force attacks and DDoS attempts.
- **Express Validator**: Robust input sanitization and verification on API endpoints.
- **CORS**: Secured Cross-Origin Resource Sharing policy between Next.js and Express server.

---

## 🗄️ Database Schema Reference (Mongoose models)

- **User**: Name, email, hashed password, role (student/landlord), phone, and avatar.
- **Room**: Title, description, price, location details, images array, amenities, availability, and owner ID reference.
- **Booking**: Links user (student) and room, including booking dates, rent details, and approval status (pending, confirmed, cancelled).
- **RoommateProfile**: References user and records budget, habits, biography, and roommate preferences.
- **GuidePost**: Title, content, category, author reference, likes, and comment threads.

---

## 📂 Project Structure

```text
├── Backend/
│   ├── config/          # DB connection configuration
│   ├── controllers/     # Route controller logic
│   ├── middleware/      # Auth gates, validation guards, and rate limiters
│   ├── models/          # Mongoose database models
│   ├── routes/          # Express API route handlers
│   ├── server.js        # Entry point for backend Express app
│   └── package.json
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   └── app/
│   │       ├── components/ # Reusable UI components (TrustBanner, RoomSlider, etc.)
│   │       ├── context/    # Global AuthContext provider
│   │       ├── layout.js   # Root layout & page head metadata
│   │       ├── page.js     # Home page structure
│   │       └── [routes]/   # Next.js App routes (login, signup, room, owner-portal)
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Run the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and configure the variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   DEV_SECRET=nest_dev_monitor_2024
   APP_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   RESEND_API_KEY=your_resend_key
   ```
4. Start the developer server:
   ```bash
   npm run dev
   ```

### 2️⃣ Run the Next.js Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the frontend developer server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🎯 Learning Outcomes
- Relational data integrity inside a document-oriented NoSQL database (using Mongoose Populate).
- Token-based stateless authentication flow (JWT + HttpOnly Cookie / Authorization Headers).
- Middleware-driven architectures for security (rate limiters, headers, role verification).
- Building premium, responsive React layouts using Next.js App Router and Framer Motion.

---

## 📌 Future Improvements
- **Payment Gateway**: Integration of payment processing system (e.g. Stripe or Razorpay) for bookings.
- **In-App Messaging**: Real-time messaging service between students and room owners.
- **Advanced Maps Integration**: Integrating Google Maps API to search properties visually.
- **Notification Engine**: Email and SMS alerts for booking confirmations.

---

## 🙌 Author

**Yogendra Bisht**
MCA Student | Full-Stack Developer
Focused on modern web technologies and backend systems.

⭐ **If you like this project, don’t forget to star the repository!**

---

### 🔥 Pro Tip for Interviews / Presentation
When showcasing this project:
- Highlight **Mongoose population references** and database design.
- Explain the **JWT Auth middleware flow** and how route guards protect your API.
- Talk about the **API Security features** (Helmet headers, Express Rate Limits, and input validators).
