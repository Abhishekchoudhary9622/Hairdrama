# System Architecture & Philosophy

## Overview

Hairdrama Tech is built using a decoupled **Three-Layer Architecture**:
1. **Presentation Layer:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide icons.
2. **Business / Application Layer:** Flask (Python), Blueprints, Middleware (Auth, Authorization Matrix, Validation, Global Error Handling).
3. **Data Access / Repository Layer:** Repositories abstracting queries over MongoDB collections with schema validation and indexing.
4. **External Integrations:** Google OAuth 2.0 (Identity Provider) and Gmail API (Asynchronous email dispatch with resilient error handling).

---

## Architecture Diagram

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

## Authorization Matrix

Explicit permissions govern every action. Users are never authorized simply by being logged in.

| Action | Creator | Assignee | Other User | Enforcement Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **View task** | ✅ | ✅ | ❌ | `require_task_permission('view')` |
| **Edit task details** | ✅ | ❌ | ❌ | `require_task_permission('edit')` |
| **Change status** | ✅ | ✅ | ❌ | `require_task_permission('change_status')` |
| **Reassign task** | ✅ | ❌ | ❌ | `require_task_permission('assign')` |
| **Delete task** | ✅ | ❌ | ❌ | `require_task_permission('delete')` |
| **View activity log** | ✅ | ✅ | ❌ | `require_task_permission('view_activity')` |

---

## Deterministic State Machine

Tasks progress through strict state machine transitions:

```
             ┌──────────────┐
             │     TODO     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ IN_PROGRESS  │◄────────┐
             └──────┬───────┘         │
                    │                 │ Reopen
                    ▼                 │
             ┌──────────────┐         │
             │  COMPLETED   ├─────────┘
             └──────────────┘
```

### Allowed Transitions:
- `TODO` ➔ `IN_PROGRESS`
- `TODO` ➔ `COMPLETED`
- `IN_PROGRESS` ➔ `TODO`
- `IN_PROGRESS` ➔ `COMPLETED`
- `COMPLETED` ➔ `IN_PROGRESS` (Explicit reopening rule)
- Direct transition from `COMPLETED` back to `TODO` is **rejected** by validation.
