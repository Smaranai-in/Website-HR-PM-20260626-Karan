# User Application Management System

## 📌 Project Overview

This project is a **User Application Management System** designed to manage and submit different types of user applications, including:

*   🎓 **Internship Applications**
*   🔬 **Research Applications**
*   📚 **Academic Projects**
*   🧑‍🏫 **Courses**

The system uses **Supabase** as the backend for authentication, database, storage (buckets), and edge functions, while the frontend is built using **Node.js / React**.

### 🌟 New: Professional Pro Workspace
Upon selection, interns gain access to a state-of-the-art "Pro" management portal featuring:
*   ✨ **Advanced Glassmorphism UI**: A premium, modern interface with backdrop blurs and ambient background effects.
*   📈 **Real-time Performance Analytics**: Dynamic stat cards tracking task completion, in-progress work, and overall project velocity.
*   🎯 **Task Orchestration**: A high-fidelity task board with status-based accent bars, priority levels, and interactive progress monitoring.
*   🕒 **Precision Attendance**: Seamless check-in/out and break tracking with immediate visual confirmation.
*   📊 **Intelligent Reporting**: Streamlined submission of daily reports with integrated supervisor feedback loops.
*   🔐 **Absolute Session Persistence**: A robust auth restoration engine ensuring zero-logouts on page refresh or browser restart.

### 🛡️ Core Infrastructure: Protected Routing
The application now utilizes a centralized `ProtectedRoute` architecture:
*   **Persistent URL Restoration**: The app remembers your exact page during refresh and session restoration.
*   **Auth Initialization Guard**: No routes are rendered until the Supabase session is definitively resolved, preventing flicker and premature redirects.

---

## 🔄 End-to-End Workflow

This section describes how a user interacts with the system from start to finish.

1.  **Registration & Login**:
    *   A new user visits the site and signs up using Email or Google OAuth via the unified `/user/dashboard/login` portal.
    *   Once logged in, they are redirected based on their role (Intern/HR/Supervisor).
    *   A profile is automatically created in the `w_users` table if it doesn't exist.

2.  **Profile Setup**:
    *   The user navigates to the Profile section to add details like Phone Number, University, and Profile Picture.
    *   This ensures all future applications are pre-filled with correct data.

3.  **Applying for an Internship**:
    *   User selects "Internships" from the dashboard.
    *   Fills out the application form (Resume, Skills, Availability).
    *   Submits the form. The data is saved to `w_internship_applications`.
    *   The user can track their comprehensive timeline (Pending -> Interview -> Selected) and view Admin remarks centrally on their **My Page** dashboard.

4.  **Premium Intern Dashboard Interface**:
    *   Selected interns use the dashboard to manage daily operations.
    *   Features include an Attendance Banner, Today's Priority Tasks, and Quick Stats for performance overview.
    *   All activities are synchronized with the Admin Panel for supervisor oversight.

4.  **Taking an AI Interview**:
    *   If required for an internship, users navigate to **My Page** to start an AI Interview.
    *   The interview utilizes the GEMINI model for technical Q&A based on the uploaded resume.
    *   Once finished, users can review their performance metrics, scores, and AI feedback on the **My Page** dashboard.

5.  **Assessment Assignments (New Integration)**:
    *   Internship applicants get assigned specific evaluation tasks based on their applied role.
    *   Assessments feature a countdown timer (e.g., 3 days limit) and dynamic assignment previews.
    *   Submissions are sent via URL references directly tracked within the backend DB.

6.  **Enrolling in a Course**:
    *   User browses available courses.
    *   Clicks "Enroll" on a course.
    *   An entry is made in `w_course_enrollments`, and the user gains access to course materials.

7.  **Research & Projects**:
    *   Users can similarly submit proposals for Research or Academic Projects.
    *   Admins review these proposals and approve/reject them.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js with Tailwind CSS
*   **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
*   **Runtime**: Node.js
*   **Package Manager**: npm

---

## 📂 Database Schema (SQL)

All tables in this project use the `w_` prefix to distinguish them from system tables.

<details>
<summary><strong>Click to view full SQL Schema</strong></summary>

```sql
-- 1. Users Table
create table if not exists w_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text default 'client',
  profile_url text default null,
  user_verify boolean default false,
  created_at timestamp default now()
);

-- 2. Internship Applications
create table w_internship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone_number text not null,
  email text not null,
  linkedin_profile text,
  portfolio_url text,
  github_url text,
  university text,
  country text,
  state text,
  city text,
  program_type text,
  branch text,
  graduation_year text,
  is_student boolean default false,
  is_working_professional boolean default false,
  has_internship_exp boolean default false,
  work_experience_desc text,
  internship_exp_desc text,
  top_priority_role text,
  availability text,
  start_week text,
  end_week text,
  start_time time,
  end_time time,
  interview_date date,
  available_to_join text,
  cv_url text,
  is_select text,              -- example: Pending / Completed / Selected
  review text[],               -- ARRAY["nm,.","rtyuiokjh"]
  reviewtimestamp text[] ,
  created_at timestamp with time zone default now()
);

-- 3. Academic Projects
CREATE TABLE public.w_academic_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  project_domain TEXT NOT NULL,
  project_title TEXT NOT NULL,
  description TEXT,
  document_url TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  college TEXT,
  grad_year TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Research Enrollments
CREATE TABLE public.w_research_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  state TEXT,
  city TEXT,
  college TEXT,
  grad_year TEXT,
  role TEXT,
  topic TEXT NOT NULL,
  stage TEXT NOT NULL,
  description TEXT NOT NULL,
  support_needed TEXT NOT NULL,
  document_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Courses
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

-- 6. Course Enrollments
CREATE TABLE public.w_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phno TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT,
  college_university TEXT,
  degree_program TEXT,
  year_of_study TEXT,
  field_of_study TEXT,
  prior_experience TEXT,
  how_did_you_hear_about_us TEXT,
  reason_for_taking_course TEXT,
  course_id UUID,
  status TEXT DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Assessment Outlines (New Integration)
CREATE TABLE internship_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    heading TEXT NOT NULL,
    role TEXT NOT NULL,
    details TEXT,
    difficulty TEXT DEFAULT 'Intermediate',
    days INTEGER DEFAULT 3,
    hrs INTEGER,
    hasimage BOOLEAN DEFAULT false,
    taskimage TEXT,
    isactive BOOLEAN DEFAULT true
);

-- 8. Student Assessments (New Integration)
CREATE TABLE internship_student_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL,
    internship_application_id UUID NOT NULL REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    assessment_outline_id UUID NOT NULL REFERENCES internship_assessments(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    submission_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE
);
```
</details>

---

## ⚙️ Prerequisites

*   Node.js (v16+ recommended)
*   npm
*   Supabase account

---

## 🚀 Project Setup & Run

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the `User` root directory and add:

```env
REACT_APP_SUPABASE_URL='https://uqkqewydjbqqiuezxnqk.supabase.co'
REACT_APP_SUPABASE_ANON_KEY='sb_publishable_ZPjIspJAXUtFxFBwrVvTKQ_k6RITrqo'
```

### Step 3: Start the Project

```bash
npm start
```

The User Dashboard starts natively on: `http://localhost:3000`. 
If you intend to work on the backend configuration updates or administrative tasks, you will simultaneously need to run `npm start` in the `Admin` window (which naturally targets `http://localhost:3001` instead), as they function inter-dependently via the Supabase SQL database.
