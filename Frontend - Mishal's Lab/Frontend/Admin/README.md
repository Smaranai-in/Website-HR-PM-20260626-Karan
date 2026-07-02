# Admin Dashboard

This is the **Admin Dashboard** for the User Application Management System. It allows administrators to view submitted applications, manage user roles, and oversee system data.

---

## 🔄 Admin Workflow

1.  **Granting Admin Access**:
    *   By default, all sign-ups are 'clients' (users).
    *   To make someone an Admin, a database update is required (see SQL below).
    *   Once promoted, the user can log in to this `Admin` dashboard.

2.  **Reviewing Applications**:
    *   **Internships**: Admins see a list of all applicants. They can review Resumes, attach persistent remarks, and change statuses (Pending → Interview Scheduled → Selected). These remarks and status updates are visible linearly on the user's **My Page** timeline.
    *   **Pro Workspace Oversight**: Monitoring of the **Professional Pro Workspace**, including real-time performance analytics, task velocity, and project health indicators.
    *   **Absolute Session Persistence**: Implemented a robust auth restoration engine ensuring that Admins stay logged in across page refreshes and browser restarts.
    *   **Attendance Tracking**: Admins can monitor real-time check-in/out and break history for interns.
    *   **Daily Reports**: Review and provide feedback on daily work summaries submitted by interns.
    *   **AI Interviews**: Admins can review the outcome of automated AI Interviews (including proctoring details, tab switches, and scores) directly linked to the user's application.
    *   **Assessments**: Following the initial AI Interview, Admins can review Assessment tasks submitted by applicants (stored in `internship_student_assessments`) and evaluate their GitHub/Drive URLs.
    *   **Task Management**: Oversight of tasks assigned to interns, categorized by priority and deadline.
    *   **Research & Projects**: Similar workflows for academic and research proposals.

3.  **Managing Courses**:
    *   Admins can view enrolled students and manage course content (if implemented in UI, otherwise via SQL).

---

## 🛠️ Tech Stack

*   **Frontend**: React.js with Tailwind CSS
*   **Backend**: Supabase (PostgreSQL + Auth + Storage)
*   **Runtime**: Node.js
*   **Package Manager**: npm

---

## 📂 Database Schema (SQL)

The Admin app interacts with the same tables as the User app, but with elevated privileges.

### 🔑 Critical SQL: Promoting an Admin

To grant a user access to this dashboard, run this SQL query in your Supabase SQL Editor:

```sql
-- Replace 'USER_UUID_HERE' with the actual user ID from the Authentication tab
UPDATE public.w_users
SET role = 'admin'
WHERE id = 'USER_UUID_HERE';
```

### 📚 Course Management Schema

The courses displayed in the User app are managed via this table:

<details>
<summary><strong>Click to view Courses Table SQL</strong></summary>

```sql
CREATE TABLE public.w_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name text NOT NULL,
  course_domain text NOT NULL,
  description text,
  course_level text,
  how_many_weeks integer,
  total_enrolled integer DEFAULT 0,
  course_array text[],
  course_week_array jsonb[],
  course_logo text,
  domain_id uuid,
  courseFee numeric(10,2),
  created_at timestamptz DEFAULT now()
);
```
</details>

---

## ⚙️ Prerequisites

*   Node.js (v16+ recommended)
*   npm
*   Supabase project (shared with the User app)

---

## 🚀 Project Setup & Run

### Step 1: Install Dependencies

Navigate to the `Admin` directory and install dependencies:

```bash
cd Admin
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the `Admin` root directory and add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL='https://uqkqewydjbqqiuezxnqk.supabase.co'
REACT_APP_SUPABASE_ANON_KEY='sb_publishable_ZPjIspJAXUtFxFBwrVvTKQ_k6RITrqo'
```

### Step 3: Start the Project

```bash
npm start
``` 

The Admin Dashboard is configured to run automatically on: `http://localhost:3001`

> **Note**: For the best development experience, run the **User** Dashboard (`npm start` in `/User`) simultaneously. The User dashboard runs on `http://localhost:3000`.
