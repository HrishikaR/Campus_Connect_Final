# CampusConnect

### Smart University Collaboration & Resource Management Platform

CampusConnect is a full-stack MERN application that streamlines university collaboration by providing a centralized platform for campus resource booking, student clubs, event management, announcements, reviews, and role-based administration. The platform enables secure user authentication, efficient facility reservations, and seamless interaction between students, faculty, club leaders, and administrators.

---

## Features

### Authentication & Security
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (Student, Faculty, Club Leader, Super Admin)
- Password hashing using bcrypt
- Protected API routes
- Secure authentication middleware

### Campus Resource Management
- Search and browse campus facilities
- Real-time resource availability
- Facility booking with conflict detection
- Booking history and cancellation

### Clubs & Communities
- Browse student clubs
- Membership request workflow
- Club leader approval/rejection system
- Club event management

### Events
- Create and manage campus events
- RSVP registration
- Event categorization and search

### Announcements
- Publish official university announcements
- Priority-based notifications
- Category-wise filtering

### Reviews & Ratings
- Review campus facilities
- Star rating system
- Community feedback management

### User Dashboard
- Personalized dashboard
- Booking history
- Notifications
- Profile management

### Media Uploads
- Cloudinary image uploads
- Profile image support

---

# Technology Stack

## Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary
- Helmet
- Morgan
- CORS

---

# System Architecture

```
React Frontend
       │
       ▼
Axios API Layer
       │
       ▼
Express REST API
       │
       ▼
Controllers
       │
       ▼
MongoDB (Mongoose)
```

---

# Project Structure

```
CampusConnect
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── config
│
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   └── assets
│
├── server.js
├── package.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/CampusConnect.git
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file in the project root.

```env
APP_URL=http://localhost:3000

MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect

JWT_SECRET=your_jwt_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

## Run Development Server

```bash
npm run dev
```

Application runs at

```
http://localhost:3000
```

---

# Demo Accounts

| Role | Email | Password |
|------|------|------|
| Student | student@campus.edu | student123 |
| Faculty | faculty@campus.edu | faculty123 |
| Club Leader | leader@campus.edu | leader123 |
| Super Admin | admin@campus.edu | admin123 |

---

# API Modules

- Authentication
- Users
- Resources
- Bookings
- Clubs
- Events
- Reviews
- Notifications
- Announcements
- Uploads
- Admin

---

# Security Features

- JWT Authentication
- Refresh Token Authentication
- Role-Based Access Control (RBAC)
- Password Hashing (bcrypt)
- Protected Routes
- Secure HTTP Headers (Helmet)
- Input Validation
- CORS Configuration

---

# Future Enhancements

- Email Notifications
- Real-Time Chat
- QR Code Check-in
- Mobile Application
- AI-powered Event Recommendations
- Analytics Dashboard

---

# Screenshots

> Add screenshots after deployment.

- Login
- Dashboard
- Resource Booking
- Clubs
- Events
- Admin Dashboard

---

# Deployment options

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

---

# License

This project was developed for educational purposes and placement portfolio demonstration.
