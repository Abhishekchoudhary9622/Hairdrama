# Hairdrama Tech — Task Management System

An enterprise-grade, high-performance Task Management System built with a strict **Three-Layer Architecture**: **Next.js + TypeScript** (Presentation Layer), **Flask + Python** (Business / Application Layer), and **MongoDB** (Persistence Layer), integrated with **Google OAuth 2.0** and **Gmail API**.

---

## 🌟 Key Features

- **Google OAuth 2.0 Authentication**: Cryptographically verified identity derivation with signed JWT sessions and developer test profiles.
- **Strict Role & Permission Matrix**: Creator vs. Assignee authorization model. Only creators can edit, reassign, or delete; assignees can update workflow state.
- **Task State Machine**: Deterministic progression (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ Reopen to `IN_PROGRESS`) with validation.
- **Priority Engine**: Granular severity flags (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Real-Time In-App Notifications**: Unread badges and instant task assignment/status alert feeds.
- **Gmail API Notifications**: Decoupled asynchronous email dispatch on task assignment and completion with resilient error handling.
- **Activity History & Audit Trails**: Timestamped timeline tracking creator actions, assignment changes, and state transitions.
- **Modern Dashboard**: Productivity metrics (Total, To Do, In Progress, Completed, Overdue), multi-criteria filtering, and instant search.

---

## 🏗️ Architecture Overview

```
                                      ┌─────────────────────┐
                                      │       USER          │
                                      │ Browser / Desktop   │
                                      └──────────┬──────────┘
                                                 │
                                                 │ HTTPS
                                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                         VERCEL                                     │
│                     NEXT.JS FRONTEND                               │
│                     TypeScript + Tailwind CSS                      │
│                                                                    │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐                │
│  │ Auth UI    │  │ Dashboard   │  │ Task Manager │                │
│  └────────────┘  └─────────────┘  └──────────────┘                │
│                                                                    │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐                │
│  │ Task Form  │  │ User Search │  │ Notifications│                │
│  └────────────┘  └─────────────┘  └──────────────┘                │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               │ REST API / HTTPS
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                       RENDER / RAILWAY                             │
│                         FLASK API                                  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    API ROUTES                              │    │
│  │  /api/auth     /api/users     /api/tasks     /notifications│    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                      │
│                             ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE                             │    │
│  │  Authentication │ Authorization │ Validation │ ErrorHandler│    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                      │
│                             ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                     SERVICES                              │    │
│  │  Auth Service │ Task Service │ User Service │ Email Service│    │
│  └───────────────┬─────────────────────────────┬──────────────┘    │
│                  │                             │                   │
│                  ▼                             ▼                   │
│          ┌───────────────┐              ┌─────────────────┐        │
│          │ Repository    │              │ External APIs   │        │
│          │ Layer         │              │                 │        │
│          └───────┬───────┘              │ Google OAuth    │        │
│                  │                      │ Gmail API       │        │
│                  │                      └─────────────────┘        │
└──────────────────┼─────────────────────────────────────────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │        MONGODB          │
        │                         │
        │ ┌─────────────────────┐ │
        │ │ users               │ │
        │ │ tasks               │ │
        │ │ notifications       │ │
        │ │ task_activity       │ │
        │ └─────────────────────┘ │
        └─────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Local daemon or free MongoDB Atlas URI)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# (Optional) Run collection indexing and demo user seeder
python migrations/setup_mongo.py

# Run the Flask API server (Default: http://localhost:5000)
python run.py
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run Next.js development server (Default: http://localhost:3000)
npm run dev
```

---

## 🧪 Testing

### Backend Unit & Integration Tests (15 Tests)
```bash
cd backend
pytest tests/ -v
```
Verifies:
- Dev login & Google OAuth endpoints
- Authorization matrix enforcement (Creator vs Assignee vs Other User)
- State machine transition rules (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ Reopening)
- In-app notification creation & unread counter updates
- Task metrics & activity logging

### Frontend Build & Typecheck
```bash
cd frontend
npm run build
```

---

## 👥 Two-User End-to-End Test Demonstration (Section 27)

To demonstrate the full interaction flow in under 2 minutes:

1. **Open** `http://localhost:3000/login`.
2. **Click** the instant test profile: **Abhishek Verma (Creator)**.
3. **Create a Task**:
   - Title: `Fix authentication token refresh`
   - Priority: `HIGH`
   - Assignee: `Rahul Sharma`
   - Due Date: Select upcoming date.
   - Click **Create Task**.
   - *Activity log & in-app notification are generated; asynchronous email dispatch is triggered.*
4. **Switch Persona** to **Rahul Sharma (Assignee)** using the Navbar switcher or login screen.
5. **Inspect Notification Bell (🔔)**:
   - Notice the unread alert badge: *"Abhishek Verma assigned you the task..."*
6. **Start & Complete Task**:
   - Click **Start Progress** (`TODO` ➔ `IN_PROGRESS`).
   - Click **Mark Completed** (`IN_PROGRESS` ➔ `COMPLETED`).
7. **Switch back to Abhishek Verma**:
   - Notice the in-app notification: *"Rahul Sharma completed the task..."*
   - Open task details to inspect the immutable **Activity Audit Trail**.

---

## 🎤 Interview Explanation Summary (Section 35)

> *"I designed the application using a three-layer architecture. Next.js handles the presentation layer, Flask handles the API and business logic, and MongoDB handles persistence via a repository pattern. Authentication is handled through Google OAuth 2.0 with cryptographically verified sessions. The Gmail API is decoupled into a resilient email service so that task management operations succeed even if external email delivery encounters intermittent network failures. Flask routes receive requests, authentication and authorization middleware enforces an explicit permission matrix, services handle business workflows, and repositories manage database operations. I also built activity audit logs and in-app notifications to deliver an enterprise-grade experience."*
