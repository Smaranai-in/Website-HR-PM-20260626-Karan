# HANDOVER REPORT

**Project Name:** SmaranAI  
**Outgoing Developer:** Mishal K (Junior Full Stack & AI Developer)  
**Date:** June 30, 2026  

---

## 1. PROJECT OVERVIEW
SmaranAI is an internship management and learning portal consisting of a **User Portal** (for student applicants, enrolled course members, and active interns) and an **Admin Portal** (for administrators/supervisors to track attendance, review assessments, evaluate AI interview submissions, and manage leave requests). The platform runs on a serverless backend using Supabase authentication, database, edge storage, and edge functions.

---

## 2. CURRENT PROJECT STATUS
The project is currently stable, fully integrated, and **100% production-ready**. All core workflows (AI Interview, Leave approvals, Attendance logs, real-time support chat, and Course forms) have been built, thoroughly tested for JWT expiration issues and schema limitations, and successfully deployed.

---

## 3. COMPLETED MODULES
- **AI Mock Interview Engine:** Captures resume uploads, uses Gemini 1.5 Flash to generate custom questions, records audio answers via browser microphone, and performs automatic AI evaluation.
- **Leave Request Management:** Interns can submit leave requests with files. Admins can view requests, filter them dynamically (including on mobile), and submit approval/rejection decisions with custom remarks.
- **Daily Work & Attendance Logs:** Features check-in, check-out, and active break trackers. Automatically stores work hours adjusted to Indian Standard Time (IST).
- **Interactive Support Chat Widget:** Supports real-time thread messaging, message editing/deleting, and reading receipts.
- **Admin Dashboard Layout & Quick Navigation:** Responsive navigation header linked directly to operational tables.

---

## 4. PENDING WORK / FUTURE ENHANCEMENTS
- **Email Notifications:** Auto-send email notifications to interns when their leave requests are approved or rejected.
- **Push Notifications:** Alert interns instantly when new tasks or mock assessments are assigned.
- **PWA Capabilities:** Add service workers to enable offline caching for daily reports.

---

## 5. CODEBASE FOLDER STRUCTURE
```
PardhaSaradhi-11-05-2026/
├── Admin/                   # React Admin Portal Dashboard
│   ├── src/
│   │   ├── Admin/           # Admin modules (AI Interview table, Leave management, etc.)
│   │   ├── components/      # Common UI components (Header, Profile)
│   │   └── lib/             # API handlers (actions.js, data.js communicating with w_edge)
│   ├── .env                 # Admin env credentials
│   └── package.json
│
├── User/                    # React Intern & Student Portal
│   ├── src/
│   │   ├── Pages/           # Intern activities, tasks, daily report loggers
│   │   ├── components/      # Chat widget, course cards, syllabus pages
│   │   └── context/         # AuthModalContext, AssessmentContext (state management)
│   ├── .env                 # User env credentials
│   └── package.json
│
├── database/                # Schema blueprints & migrations
│   ├── master_schema.sql    # Setup script for w_users, w_messages, w_internship_applications
│   └── leaves_and_daily_reports.sql # Setup script for w_leaves table & constraints
│
└── supabase/                # Supabase Serverless configuration
    └── functions/           # Deno Edge Functions
        ├── w_edge/          # Core controller routing cases
        │   └── index.ts
        ├── Interview_grade-interview/
        └── Interview_generate-questions/
```

---

## 6. DATABASE SCHEMA & TABLE DETAILS
*   **public.w_users:** Stores profile and role definitions. Primary key `id` references `auth.users(id)`.
*   **public.w_leaves:** Tracks leave requests. Column `user_id` references `auth.users(id)`.
*   **public.w_internship_applications:** Stores candidate applicant data (name, email, current status).
*   **public.intern_daily_reports:** Stores daily task logs, logged hours, and blocker details.
*   **public.intern_attendance:** Tracks active timer records, check-in, check-out, and break durations.
*   **public.w_messages:** Real-time thread data for support chat widget.

---

## 7. API ENDPOINTS & ROUTING (w_edge)
All actions are handled through a single edge router endpoint (`/functions/v1/w_edge`). Payloads must specify the `"action"` string:
- `"get_all_leaves"`: Fetches leave requests and programmatically joins profile names/emails from `w_users`.
- `"update_leave_status"`: Approves/rejects leaves and saves admin remarks.
- `"apply_leave"`: Creates a new pending request.
- `"get_my_leaves"`: Fetches leave logs for the authenticated user.
- `"create_internship_application"`: Submits new application records.

---

## 8. ENVIRONMENT SETUP
Create `.env` files in both the `/Admin` and `/User` folders:
```env
REACT_APP_SUPABASE_URL=https://uqkqewydjbqqiuezxnqk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_...
```

For Supabase Edge Functions, secrets are configured on the Supabase Dashboard:
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

---

## 9. INSTALLATION & EXECUTION STEPS
To run the portals locally:
1. Open a terminal in `/Admin` and start the server:
   ```bash
   npm install
   npm start
   ```
   *(Running on http://localhost:3001)*
2. Open a second terminal in `/User` and start the server:
   ```bash
   npm install
   npm start
   ```
   *(Running on http://localhost:3000)*

---

## 10. DEPLOYING EDGE FUNCTIONS
Ensure the Supabase CLI is available. Run this command from the project root to push local edge function updates to production:
```bash
npx supabase functions deploy w_edge --project-ref uqkqewydjbqqiuezxnqk
```

---

## 11. KEY CODE ARCHITECTURE & RESOLVED BUGS
- **JWT Fix:** The edge function was updated to pass the token explicitly. Rather than initializing client options on global headers, Deno executes `auth.getUser(token)` directly. This guarantees user validation even if tokens are close to expiry.
- **SQL Relationship Error:** `w_leaves.user_id` does not have a database foreign key pointing to `w_users.id` (it points to `auth.users`). Consequently, relational joins in SQL will fail. We bypassed this by querying lists separately in Deno and programmatically joining them in memory.

---

## 12. SUGGESTIONS FOR THE NEXT DEVELOPER
1. **Always verify token presence:** When calling edge function actions, retrieve the latest access token via `supabase.auth.getSession()` and pass it under the `Authorization` header.
2. **Handle timezones locally:** Dates stored in databases default to UTC. When displaying daily reports or attendance logs, extract `YYYY-MM-DD` strings directly to match Indian Standard Time (IST) offset rules.
3. **Database migrations:** Run all tables, indexes, and policy configurations using the SQL editor in the Supabase Dashboard by loading script files inside the `/database` folder.
