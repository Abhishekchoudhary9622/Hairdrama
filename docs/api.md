# REST API Reference

All requests and responses use JSON.

## Response Standards

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional status message"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable error description",
    "details": null
  }
}
```

---

## Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/auth/google` | Generates Google OAuth 2.0 authorization URL | No |
| `GET` | `/api/auth/google/callback` | OAuth redirect callback; returns JWT token session | No |
| `GET` | `/api/auth/me` | Fetches current verified user profile | Yes |
| `POST` | `/api/auth/logout` | Invalidates active session | No |
| `POST` | `/api/auth/dev-login` | Quick testing switcher (Abhishek vs Rahul) | No |

---

## User Endpoints (`/api/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users/me` | Current user details | Yes |
| `PATCH`| `/api/users/me` | Updates profile name or avatar | Yes |
| `GET` | `/api/users` | List all team members | Yes |
| `GET` | `/api/users/search?q=` | Search team members by name or email | Yes |

---

## Task Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Auth Required | Permission |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/tasks` | List tasks (supports `status`, `priority`, `search`, `view`) | Yes | None |
| `POST` | `/api/tasks` | Create task, logs activity, creates alert, dispatches email | Yes | None |
| `GET` | `/api/tasks/stats` | Aggregated dashboard productivity counts | Yes | None |
| `GET` | `/api/tasks/:id` | Get single task details with creator & assignee objects | Yes | Creator or Assignee |
| `PATCH`| `/api/tasks/:id` | Update task title, description, priority, or due date | Yes | Creator Only |
| `PATCH`| `/api/tasks/:id/status`| Transition status (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED`) | Yes | Creator or Assignee |
| `PATCH`| `/api/tasks/:id/assign`| Reassign task to a different team member | Yes | Creator Only |
| `DELETE`| `/api/tasks/:id` | Permanently remove task | Yes | Creator Only |
| `GET` | `/api/tasks/:id/activity`| Get full audit trail of updates and state transitions | Yes | Creator or Assignee |

---

## Notification Endpoints (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/notifications` | Returns user alerts and unread counter | Yes |
| `PATCH`| `/api/notifications/:id/read` | Mark single notification as read | Yes |
| `PATCH`| `/api/notifications/read-all` | Mark all user notifications as read | Yes |
