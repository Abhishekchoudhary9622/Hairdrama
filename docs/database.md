# Database Design & Persistence

## Overview

Hairdrama Tech utilizes **MongoDB** (with PyMongo and standard index structures) for document storage, backed by repository abstraction. Both MongoDB Atlas cloud clusters and local MongoDB instances are supported out of the box.

---

## Collections & Schemas

### 1. `users`
Represents verified team members and creators.

```json
{
  "id": "UUID string",
  "google_id": "string (unique, sparse)",
  "email": "string (unique, lowercase)",
  "name": "string",
  "avatar_url": "string url",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Indexes:**
- `email`: Unique index (`ASCENDING`)
- `google_id`: Unique sparse index (`ASCENDING`)

---

### 2. `tasks`
Core deliverables tracked in the system.

```json
{
  "id": "UUID string",
  "title": "string (1-255 chars)",
  "description": "text",
  "status": "TODO | IN_PROGRESS | COMPLETED",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "created_by": "UUID -> users.id",
  "assigned_to": "UUID -> users.id",
  "due_date": "ISO 8601 timestamp or null",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "completed_at": "ISO 8601 timestamp or null"
}
```

**Indexes:**
- `created_by`: Index (`ASCENDING`)
- `assigned_to`: Index (`ASCENDING`)
- `status`: Index (`ASCENDING`)
- `priority`: Index (`ASCENDING`)
- `due_date`: Index (`ASCENDING`)
- `created_at`: Index (`DESCENDING`)

---

### 3. `notifications`
In-app alert feeds for assignment and status transitions.

```json
{
  "id": "UUID string",
  "user_id": "UUID -> users.id",
  "task_id": "UUID -> tasks.id",
  "type": "TASK_ASSIGNED | TASK_COMPLETED | TASK_STATUS_CHANGED",
  "title": "string",
  "message": "text",
  "is_read": false,
  "created_at": "ISO 8601 timestamp"
}
```

**Indexes:**
- Compound index on `(user_id, is_read)`
- `created_at`: Index (`DESCENDING`)

---

### 4. `task_activity`
Immutable audit log recording user modifications and state changes.

```json
{
  "id": "UUID string",
  "task_id": "UUID -> tasks.id",
  "user_id": "UUID -> users.id",
  "action": "CREATED_TASK | STATUS_CHANGED | ASSIGNED_TASK | UPDATED_TASK",
  "old_value": "string or null",
  "new_value": "string or null",
  "created_at": "ISO 8601 timestamp"
}
```

**Indexes:**
- `task_id`: Index (`ASCENDING`)
- Compound index on `(task_id, created_at DESC)`
- `user_id`: Index (`ASCENDING`)

---

## Migration Scripts

- PostgreSQL reference schemas: `backend/migrations/001_create_users.sql` through `004_create_task_activity.sql`
- MongoDB index & seed setup: `backend/migrations/setup_mongo.py`
  - Run via: `python backend/migrations/setup_mongo.py`
