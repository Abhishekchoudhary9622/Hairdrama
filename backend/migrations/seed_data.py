import os
import uuid
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

def seed_database():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/hairdrama_tasks")
    db_name = os.getenv("MONGODB_DB_NAME", "hairdrama_tasks")

    print(f"Connecting to MongoDB at {uri} (Database: {db_name})...")
    client = MongoClient(uri, serverSelectionTimeoutMS=3000)
    db = client[db_name]

    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    # Clear existing data to ensure clean, consistent state
    db["users"].delete_many({})
    db["tasks"].delete_many({})
    db["notifications"].delete_many({})
    db["task_activity"].delete_many({})

    print("Cleared existing collections.")

    # 1. Users
    users = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "google_id": "google-demo-abhishek-101",
            "email": "abhishek@hairdrama.tech",
            "name": "Abhishek Verma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek",
            "created_at": (now - timedelta(days=30)).isoformat(),
            "updated_at": now_iso,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "google_id": "google-demo-rahul-102",
            "email": "rahul@hairdrama.tech",
            "name": "Rahul Sharma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
            "created_at": (now - timedelta(days=25)).isoformat(),
            "updated_at": now_iso,
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "google_id": "google-demo-neha-103",
            "email": "neha@hairdrama.tech",
            "name": "Neha Patel",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
            "created_at": (now - timedelta(days=20)).isoformat(),
            "updated_at": now_iso,
        },
        {
            "id": "44444444-4444-4444-4444-444444444444",
            "google_id": "google-demo-sneha-104",
            "email": "sneha@hairdrama.tech",
            "name": "Sneha Kapoor",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
            "created_at": (now - timedelta(days=15)).isoformat(),
            "updated_at": now_iso,
        },
    ]
    db["users"].insert_many(users)
    print(f"Seeded {len(users)} users.")

    abhishek_id = users[0]["id"]
    rahul_id = users[1]["id"]
    neha_id = users[2]["id"]
    sneha_id = users[3]["id"]

    # 2. Tasks definition matching Section 19 distribution:
    # Total: 24 tasks | To Do: 8 | In Progress (Active): 6 | Done: 10 | Overdue: 2
    tasks_data = [
        # --- ACTIVE / IN PROGRESS (6) ---
        {
            "id": str(uuid.uuid4()),
            "title": "Fix Google OAuth callback token expiration bug",
            "description": "Investigate JWT refresh token rotation and session expiration during multi-device login.",
            "status": "IN_PROGRESS",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=2)).isoformat(),
            "created_at": (now - timedelta(hours=8)).isoformat(),
            "updated_at": (now - timedelta(hours=3)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Refactor state machine transition validator",
            "description": "Ensure COMPLETED to TODO direct jump is strictly blocked while COMPLETED to IN_PROGRESS reopening is allowed.",
            "status": "IN_PROGRESS",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=3)).isoformat(),
            "created_at": (now - timedelta(hours=14)).isoformat(),
            "updated_at": (now - timedelta(hours=5)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Optimize MongoDB compound indexes for task queries",
            "description": "Index (created_by, status, created_at) to achieve sub-millisecond query response on large collections.",
            "status": "IN_PROGRESS",
            "priority": "MEDIUM",
            "created_by": rahul_id,
            "assigned_to": abhishek_id,
            "due_date": (now + timedelta(days=4)).isoformat(),
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(hours=6)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Build centralized API client with token interceptor",
            "description": "Standardize request headers and error handling in frontend/lib/api.ts across all components.",
            "status": "IN_PROGRESS",
            "priority": "MEDIUM",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=5)).isoformat(),
            "created_at": (now - timedelta(days=1, hours=2)).isoformat(),
            "updated_at": (now - timedelta(hours=4)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Implement task filter bar with instant debounce",
            "description": "Allow filtering by status, priority, assignee, and text search without page reload.",
            "status": "IN_PROGRESS",
            "priority": "LOW",
            "created_by": abhishek_id,
            "assigned_to": sneha_id,
            "due_date": (now + timedelta(days=6)).isoformat(),
            "created_at": (now - timedelta(days=1, hours=8)).isoformat(),
            "updated_at": (now - timedelta(hours=2)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Add role-based authorization matrix enforcement",
            "description": "Verify Creator vs Assignee permissions on view, edit, status, assign, and delete operations.",
            "status": "IN_PROGRESS",
            "priority": "URGENT",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(hours=18)).isoformat(),
            "updated_at": (now - timedelta(hours=1)).isoformat(),
            "completed_at": None,
        },

        # --- TO DO (8 total: 6 normal + 2 overdue) ---
        {
            "id": str(uuid.uuid4()),
            "title": "Audit SQL injection and NoSQL parameter sanitization",
            "description": "CRITICAL security audit: verify regex inputs and payload structures against injection attacks.",
            "status": "TODO",
            "priority": "URGENT",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=2)).isoformat(), # OVERDUE 1
            "created_at": (now - timedelta(days=4)).isoformat(),
            "updated_at": (now - timedelta(days=4)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Update API documentation contracts in docs/api.md",
            "description": "Ensure all JSON payloads match {success: true, data: {...}} standard specification.",
            "status": "TODO",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=1)).isoformat(), # OVERDUE 2
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(days=3)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Build dashboard statistics cards and metric aggregations",
            "description": "Compute Total, To Do, Active, Done, and Overdue counts via backend aggregate endpoint.",
            "status": "TODO",
            "priority": "MEDIUM",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=3)).isoformat(),
            "created_at": (now - timedelta(hours=22)).isoformat(),
            "updated_at": (now - timedelta(hours=22)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Configure Dockerfile and production WSGI runner",
            "description": "Prepare production containerization for deployment on Render or Railway.",
            "status": "TODO",
            "priority": "LOW",
            "created_by": rahul_id,
            "assigned_to": abhishek_id,
            "due_date": (now + timedelta(days=7)).isoformat(),
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Review Loom technical walkthrough recording script",
            "description": "Rehearse explanation of 3-layer architecture, Google OAuth, and Gmail resilience for the interview.",
            "status": "TODO",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=4)).isoformat(),
            "created_at": (now - timedelta(hours=10)).isoformat(),
            "updated_at": (now - timedelta(hours=10)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Setup CSP and CORS security headers for Next.js",
            "description": "Configure helmet-style headers and HTTPS enforcement for Vercel deployment.",
            "status": "TODO",
            "priority": "MEDIUM",
            "created_by": abhishek_id,
            "assigned_to": neha_id,
            "due_date": (now + timedelta(days=5)).isoformat(),
            "created_at": (now - timedelta(hours=16)).isoformat(),
            "updated_at": (now - timedelta(hours=16)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Create UserSelector searchable dropdown component",
            "description": "Allow selecting team members by name and email with avatar preview.",
            "status": "TODO",
            "priority": "MEDIUM",
            "created_by": abhishek_id,
            "assigned_to": sneha_id,
            "due_date": (now + timedelta(days=6)).isoformat(),
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat(),
            "completed_at": None,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Implement NotificationBell unread counter popover",
            "description": "Display badge count and allow marking individual or all notifications as read.",
            "status": "TODO",
            "priority": "LOW",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now + timedelta(days=8)).isoformat(),
            "created_at": (now - timedelta(hours=5)).isoformat(),
            "updated_at": (now - timedelta(hours=5)).isoformat(),
            "completed_at": None,
        },

        # --- COMPLETED / DONE (10) ---
        {
            "id": str(uuid.uuid4()),
            "title": "Implement Gmail API asynchronous email service",
            "description": "Decoupled email sender ensuring task creation never fails if email delivery encounters network issues.",
            "status": "COMPLETED",
            "priority": "URGENT",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(hours=7)).isoformat(),
            "completed_at": (now - timedelta(hours=7)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Add initial project setup and clean repository structure",
            "description": "Configured monorepo roots, Next.js frontend, Flask backend, and Git commit workflow.",
            "status": "COMPLETED",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=4)).isoformat(),
            "created_at": (now - timedelta(days=5)).isoformat(),
            "updated_at": (now - timedelta(days=4)).isoformat(),
            "completed_at": (now - timedelta(days=4)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Write 15 Pytest unit and integration test suites",
            "description": "Comprehensive tests covering auth, users, tasks, permissions, notifications, and state machines.",
            "status": "COMPLETED",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=2)).isoformat(),
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(hours=9)).isoformat(),
            "completed_at": (now - timedelta(hours=9)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Setup GitHub Actions CI pipeline for automated testing",
            "description": "Automated workflow running backend Pytest and frontend Next.js TypeScript build.",
            "status": "COMPLETED",
            "priority": "MEDIUM",
            "created_by": rahul_id,
            "assigned_to": abhishek_id,
            "due_date": (now - timedelta(days=2)).isoformat(),
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(hours=12)).isoformat(),
            "completed_at": (now - timedelta(hours=12)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Design responsive tablet and desktop task manager canvas",
            "description": "Crafted warm cream aesthetic, pill navigation buttons, and responsive grid layouts.",
            "status": "COMPLETED",
            "priority": "LOW",
            "created_by": abhishek_id,
            "assigned_to": sneha_id,
            "due_date": (now - timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(days=2)).isoformat(),
            "updated_at": (now - timedelta(hours=11)).isoformat(),
            "completed_at": (now - timedelta(hours=11)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Implement Two-User quick persona switcher for interview demo",
            "description": "Allows evaluators to seamlessly toggle between Abhishek (Creator) and Rahul (Assignee).",
            "status": "COMPLETED",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(days=2)).isoformat(),
            "updated_at": (now - timedelta(hours=8)).isoformat(),
            "completed_at": (now - timedelta(hours=8)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Configure MongoDB unique constraints and sparse indexes",
            "description": "Applied unique index on users.email and sparse unique on users.google_id.",
            "status": "COMPLETED",
            "priority": "MEDIUM",
            "created_by": rahul_id,
            "assigned_to": abhishek_id,
            "due_date": (now - timedelta(days=3)).isoformat(),
            "created_at": (now - timedelta(days=4)).isoformat(),
            "updated_at": (now - timedelta(days=3)).isoformat(),
            "completed_at": (now - timedelta(days=3)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Build task activity audit log tracking and timeline",
            "description": "Logs every CREATED, ASSIGNED, STATUS_CHANGED, and UPDATED event with timestamps.",
            "status": "COMPLETED",
            "priority": "MEDIUM",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=2)).isoformat(),
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(hours=15)).isoformat(),
            "completed_at": (now - timedelta(hours=15)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Write comprehensive system architecture documentation in docs/",
            "description": "Produced architecture.md, database.md, api.md, and authentication.md with diagrams.",
            "status": "COMPLETED",
            "priority": "LOW",
            "created_by": abhishek_id,
            "assigned_to": abhishek_id,
            "due_date": (now - timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(days=2)).isoformat(),
            "updated_at": (now - timedelta(hours=10)).isoformat(),
            "completed_at": (now - timedelta(hours=10)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Validate Next.js 16 partial prerendering and suspense boundaries",
            "description": "Eliminated runtime SSR blocking on dynamic client routes.",
            "status": "COMPLETED",
            "priority": "HIGH",
            "created_by": abhishek_id,
            "assigned_to": rahul_id,
            "due_date": (now - timedelta(days=1)).isoformat(),
            "created_at": (now - timedelta(days=2)).isoformat(),
            "updated_at": (now - timedelta(hours=6)).isoformat(),
            "completed_at": (now - timedelta(hours=6)).isoformat(),
        },
    ]

    db["tasks"].insert_many(tasks_data)
    print(f"Seeded {len(tasks_data)} tasks.")

    # 3. Task Activities matching Section 20:
    # "10:30 AM Abhishek created task"
    # "10:35 AM Abhishek assigned task to Rahul"
    # "11:20 AM Rahul changed status to In Progress"
    # "12:10 PM Rahul completed task"
    # 3. Task Activities matching Section 20:
    # "10:30 AM Abhishek created task"
    # "10:35 AM Abhishek assigned task to Rahul"
    # "11:20 AM Rahul changed status to In Progress"
    # "12:10 PM Rahul completed task"
    activities = []
    user_names = {
        abhishek_id: "Abhishek Verma",
        rahul_id: "Rahul Sharma",
        neha_id: "Neha Patel",
        sneha_id: "Sneha Kapoor"
    }

    for t in tasks_data:
        t_id = t["id"]
        c_id = t["created_by"]
        a_id = t["assigned_to"]
        c_name = user_names.get(c_id, "Abhishek Verma")
        a_name = user_names.get(a_id, "Rahul Sharma")
        c_time = datetime.fromisoformat(t["created_at"])

        # Created
        activities.append({
            "id": str(uuid.uuid4()),
            "task_id": t_id,
            "user_id": c_id,
            "action": "CREATED_TASK",
            "old_value": None,
            "new_value": t["title"],
            "created_at": t["created_at"],
        })

        # Assigned
        activities.append({
            "id": str(uuid.uuid4()),
            "task_id": t_id,
            "user_id": c_id,
            "action": "ASSIGNED_TASK",
            "old_value": None,
            "new_value": a_name,
            "created_at": (c_time + timedelta(minutes=5)).isoformat(),
        })

        # Status transition to IN_PROGRESS
        if t["status"] in ("IN_PROGRESS", "COMPLETED"):
            activities.append({
                "id": str(uuid.uuid4()),
                "task_id": t_id,
                "user_id": a_id,
                "action": "STATUS_CHANGED",
                "old_value": "TODO",
                "new_value": "IN_PROGRESS",
                "created_at": (c_time + timedelta(minutes=45)).isoformat(),
            })

        # Status transition to COMPLETED
        if t["status"] == "COMPLETED" and t.get("completed_at"):
            activities.append({
                "id": str(uuid.uuid4()),
                "task_id": t_id,
                "user_id": a_id,
                "action": "STATUS_CHANGED",
                "old_value": "IN_PROGRESS",
                "new_value": "COMPLETED",
                "created_at": t["completed_at"],
            })

    db["task_activity"].insert_many(activities)
    print(f"Seeded {len(activities)} task activities across all {len(tasks_data)} tasks.")

    # 4. In-App Notifications matching Section 20:
    # "Rahul completed 'Fix Login Bug'"
    # "You were assigned 'Update Dashboard'"
    notifs = [
        # For Abhishek (Creator / PM)
        {
            "id": str(uuid.uuid4()),
            "user_id": abhishek_id,
            "task_id": tasks_data[14]["id"],
            "type": "TASK_COMPLETED",
            "title": "Task Completed",
            "message": "Rahul Sharma completed 'Implement Gmail API asynchronous email service'",
            "is_read": False,
            "created_at": (now - timedelta(hours=7)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": abhishek_id,
            "task_id": tasks_data[16]["id"],
            "type": "TASK_COMPLETED",
            "title": "Task Completed",
            "message": "Rahul Sharma completed 'Write 15 Pytest unit and integration test suites'",
            "is_read": False,
            "created_at": (now - timedelta(hours=9)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": abhishek_id,
            "task_id": tasks_data[0]["id"],
            "type": "TASK_STATUS_CHANGED",
            "title": "Task Status Updated",
            "message": "Rahul Sharma moved 'Fix Google OAuth callback token expiration bug' to IN_PROGRESS",
            "is_read": True,
            "created_at": (now - timedelta(hours=3)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": abhishek_id,
            "task_id": tasks_data[22]["id"],
            "type": "TASK_COMPLETED",
            "title": "Task Completed",
            "message": "Neha Patel completed 'Write comprehensive system architecture documentation in docs/'",
            "is_read": True,
            "created_at": (now - timedelta(hours=10)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": abhishek_id,
            "task_id": tasks_data[6]["id"],
            "type": "TASK_ALERT",
            "title": "Task Overdue Warning",
            "message": "Task 'Audit SQL injection and NoSQL parameter sanitization' is past its scheduled deadline",
            "is_read": False,
            "created_at": (now - timedelta(hours=1)).isoformat(),
        },

        # For Rahul (Lead Engineer / Assignee)
        {
            "id": str(uuid.uuid4()),
            "user_id": rahul_id,
            "task_id": tasks_data[6]["id"],
            "type": "TASK_ASSIGNED",
            "title": "New Task Assigned",
            "message": "Abhishek Verma assigned you 'Audit SQL injection and NoSQL parameter sanitization'",
            "is_read": False,
            "created_at": (now - timedelta(hours=2)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": rahul_id,
            "task_id": tasks_data[0]["id"],
            "type": "TASK_ASSIGNED",
            "title": "New Task Assigned",
            "message": "Abhishek Verma assigned you 'Fix Google OAuth callback token expiration bug'",
            "is_read": False,
            "created_at": (now - timedelta(hours=8)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": rahul_id,
            "task_id": tasks_data[1]["id"],
            "type": "TASK_ASSIGNED",
            "title": "New Task Assigned",
            "message": "Abhishek Verma assigned you 'Refactor state machine transition validator'",
            "is_read": True,
            "created_at": (now - timedelta(hours=14)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": rahul_id,
            "task_id": tasks_data[3]["id"],
            "type": "TASK_ASSIGNED",
            "title": "New Task Assigned",
            "message": "Abhishek Verma assigned you 'Build centralized API client with token interceptor'",
            "is_read": True,
            "created_at": (now - timedelta(days=1)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": rahul_id,
            "task_id": tasks_data[7]["id"],
            "type": "TASK_ALERT",
            "title": "Task Overdue Warning",
            "message": "Task 'Update API documentation contracts in docs/api.md' is past its due date",
            "is_read": False,
            "created_at": (now - timedelta(hours=4)).isoformat(),
        },
    ]

    db["notifications"].insert_many(notifs)
    print(f"Seeded {len(notifs)} notifications.")

    print("\nDatabase successfully seeded with realistic Hairdrama Tech data!")
    print(f"Total Tasks: {len(tasks_data)} (To Do: 8, Active: 6, Done: 10, Overdue: 2)")

if __name__ == "__main__":
    seed_database()
