# Hairdrama Tech — Task Management System

A high-performance, enterprise-grade Task Management System built with a 3-tier architecture: **Next.js + TypeScript** (Presentation Layer), **Flask + Python** (Business / Application Layer), and **MongoDB** (Persistence / Data Access Layer), integrated with **Google OAuth 2.0** and the **Gmail API**.

---

## 🌟 Key Features

- **Google OAuth 2.0 Authentication**: Secure, verified identity derivation with session tokens and developer quick-switch test profiles.
- **Strict Role & Permission Matrix**: Creator vs. Assignee authorization model. Only creators can edit or delete; assignees can transition workflow state.
- **Task State Machine**: Deterministic progression (`TODO` → `IN_PROGRESS` → `COMPLETED`) with explicit audit logs.
- **Priority Engine**: Granular severity flags (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Real-Time In-App Notifications**: Unread badges and instant task assignment/status alerts.
- **Gmail API Notifications**: Decoupled asynchronous email dispatch on task assignment and completion with resilient error handling.
- **Activity History & Audit Trails**: Timestamped timeline tracking creator actions, assignment changes, and state transitions.
- **Modern Dashboard**: High-level productivity metrics, overdue task detection, multi-criteria filtering, and instant search.

---

## 🏗️ Architecture Philosophy

```
Next.js (TypeScript)  ──> Presentation Layer
Flask (Python)        ──> Business / Application Layer
Repository Layer      ──> Data Access Abstraction Layer
MongoDB               ──> Document Persistence
Google OAuth          ──> Authentication
Gmail API             ──> Asynchronous Notifications
```

---

## 📁 Monorepo Structure

```
hairdrama-task-manager/
├── frontend/             # Next.js App Router, Tailwind CSS, Lucide Icons, TypeScript
├── backend/              # Modular Flask API (Routes, Services, Repositories, Schemas)
├── docs/                 # System architecture, database, API, and authentication specs
├── .gitignore
├── LICENSE
└── README.md
```
