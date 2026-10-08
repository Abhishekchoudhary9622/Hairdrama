# Authentication & Security Architecture

## Core Philosophy

1. **Never Trust the Client:**
   The frontend is never trusted with statements such as `"I am user 123"`. The backend derives identity strictly from cryptographic verification of Google OAuth authorization tokens or signed JWT session tokens.

2. **Pipeline:**
   ```
   HTTP Request
        │
        ▼
   Authentication Middleware (verify JWT signature & decode user ID)
        │
        ▼
   Database Look-up (ensure user still exists in persistence)
        │
        ▼
   Authorization Middleware (check Creator vs Assignee matrix)
        │
        ▼
   Business Service Logic
   ```

---

## Google OAuth 2.0 Flow

```
[ User ]
   │
   ▼
1. Clicks "Continue with Google" in Next.js
   │
   ▼
2. Flask generates Google OAuth URL with scopes (email, profile, gmail.send)
   │
   ▼
3. User gives consent on accounts.google.com
   │
   ▼
4. Google redirects to Flask callback: GET /api/auth/google/callback?code=...
   │
   ▼
5. Flask exchanges authorization code for Google access token
   │
   ▼
6. Flask retrieves verified Google profile (email, name, picture)
   │
   ▼
7. Flask upserts user in MongoDB
   │
   ▼
8. Flask signs HS256 JWT session token
   │
   ▼
9. Flask redirects to Next.js /dashboard?token=<JWT>
   │
   ▼
10. Next.js extracts token, persists in localStorage, and loads dashboard
```

---

## Fast Two-User Testing (Section 27)

To allow reviewers, interviewers, and evaluators to test the full system without configuring Google Cloud credentials in advance, the system provides a development authentication endpoint:
- **POST `/api/auth/dev-login`**
  - Payload: `{"email": "abhishek@hairdrama.tech", "name": "Abhishek Verma"}` or `{"email": "rahul@hairdrama.tech", "name": "Rahul Sharma"}`
  - Issues a real, cryptographically valid JWT token signed with the server's `JWT_SECRET`.
  - Accessible via the convenient 1-Click persona switch in the Navbar and Login screens.
