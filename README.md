# 🎓 CampusConnect — Smart University Collaboration & Resource Platform

**CampusConnect** is a comprehensive, production-ready full-stack university management and collaboration platform. It unifies campus facility reservations, student club memberships, event management, official announcements, peer reviews, and interactive calendar scheduling into a single, intuitive web experience.

---

## 🌟 Key Features

### 🏢 Campus Facility Reservations
- Real-time availability tracking for study rooms, labs, auditoriums, and sports facilities.
- Interactive **Weekly Booking Calendar** with slot conflict validation.
- User booking dashboard with status filters (*Confirmed*, *Pending*, *Cancelled*).

### 👥 Clubs & Student Societies
- Society directory categorized by domain (e.g., Tech, Cultural, Sports, Innovation).
- Membership application workflow: students submit interest statements, and club leaders approve/decline applications.
- Member rosters, leader tags, and society-hosted event showcases.

### 📅 Campus Events & Workshops
- Discover campus-wide workshops, hackathons, and cultural events.
- One-click RSVP registration and attendance management.
- Dynamic search and category filtering.

### 📢 Official Announcements
- Priority-flagged campus notices (*High*, *Medium*, *Low*).
- Category badges (*Academic*, *Administration*, *Sports*, *Events*).

### ⭐️ Resource Reviews & Ratings
- Verified student reviews and star ratings for campus spaces.
- Moderation capabilities for community feedback.

### 🛡️ Security & Roles
- **Multi-Role Access Control**: `student`, `faculty`, `club_leader`, and `super_admin`.
- **JWT Authentication** with dual-token security (Access Tokens + Automatic Refresh Tokens via Axios interceptors).
- Password reset flow with secure hash hashing.

---

## 🏗️ Technology Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Lucide Icons, Recharts, Motion animations.
- **Backend**: Node.js, Express.js REST API with CORS, Helmet security headers, and Morgan logging.
- **Database**: Dual storage engine architecture — default robust seedable state with dynamic MongoDB driver support (`mongodb://127.0.0.1:27017/campusconnect`).
- **File Uploads**: Cloudinary integration for profile avatars and resource photos with memory storage fallback.

---

## 📂 Project Structure

```
campusconnect/
├── backend/
│   ├── controllers/      # Route controllers (Auth, Booking, Club, Event, Resource, Upload, etc.)
│   ├── data/             # Database initialization & seed collections
│   ├── middleware/       # JWT Auth protection, error handlers, upload middleware
│   ├── routes/           # Express API endpoints
│   └── utils/            # JWT helpers, password hashing utilities
├── src/
│   ├── components/       # Reusable UI components (Navbar, Sidebar, Modals, Cards, Badges)
│   ├── context/          # Auth & Toast Notification contexts
│   ├── pages/            # Page views (Dashboard, Resources, Clubs, Events, Calendar, Profile, Admin)
│   └── services/         # Axios API instance with automatic token refresh interceptor
├── .env.example          # Sample environment configuration
├── server.js             # Unified Node Express server & Vite middleware launcher
├── package.json          # Dependencies & npm scripts
└── README.md             # Project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB** *(Optional)*: Running locally at `mongodb://127.0.0.1:27017/campusconnect` or a cloud MongoDB Atlas instance.

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
APP_URL="http://localhost:3000"
MONGODB_URI="mongodb://127.0.0.1:27017/campusconnect"
JWT_SECRET="campusconnect_jwt_secret_key_2026_production_grade"
REFRESH_TOKEN_SECRET="campusconnect_refresh_token_secret_key_2026_production_grade"
```

### Step 3: Run Development Server
```bash
npm run dev
```
The application will launch automatically at **`http://localhost:3000`**.

---

## 🔑 Demo Login Credentials

You can test different user roles using the pre-seeded demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `student123` |
| **Faculty** | `faculty@campus.edu` | `faculty123` |
| **Club Leader** | `leader@campus.edu` | `leader123` |
| **Super Admin** | `admin@campus.edu` | `admin123` |

---

## 📡 API Endpoint Overview

### Auth Routes (`/api/auth`)
- `POST /api/auth/signup` - Register new user account.
- `POST /api/auth/login` - Authenticate user & return JWT tokens.
- `POST /api/auth/refresh` - Issue new access token using valid refresh token.
- `GET /api/auth/me` - Fetch authenticated user profile.

### Facilities & Bookings (`/api/resources`, `/api/bookings`)
- `GET /api/resources` - List all campus facilities.
- `POST /api/bookings` - Reserve a facility slot.
- `GET /api/users/bookings` - Fetch user's active bookings.
- `DELETE /api/bookings/:id` - Cancel a booking.

### Clubs & Membership (`/api/clubs`)
- `GET /api/clubs` - List campus societies.
- `POST /api/clubs/:id/request` - Submit membership application with statement.
- `POST /api/clubs/:id/approve` - Approve pending applicant (Leader/Admin).
- `POST /api/clubs/:id/reject` - Decline pending applicant (Leader/Admin).

### Image Upload (`/api/upload`)
- `POST /api/upload` - Upload image asset to Cloudinary / memory buffer.

---

## 📦 Production Deployment

To build the static frontend assets and start the backend server for production:

```bash
npm run build
npm start
```

The unified Express server will serve static assets from `dist/` in production mode while handling all API requests seamlessly on port `3000`.

---

## 📄 License
This project is open-source and built for educational and campus infrastructure deployment.
