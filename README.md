# User Application Management System

Welcome to the **User Application Management System** repository. This project is a comprehensive solution for managing internship, research, and academic project applications. It is divided into two main components: a User-facing application and an Admin dashboard.

## 🌟 Key Updates & Enhancements

This project has undergone significant improvements to enhance user experience, security, and developer productivity:

### 🎨 UI/UX Overhaul
*   **Professional Pro Workspace**: Introduced a state-of-the-art "Pro" version of the Intern Workspace featuring advanced glassmorphism, ambient background effects, and a highly polished information architecture.
*   **Modern Design Language**: Switched to a curated high-contrast light theme with sophisticated indigo/blue accents, optimized for professional environments and long-term readability.
*   **Dynamic Data Visualization**: Integrated real-time analytics cards in the intern dashboard to track task completion, velocity, and project health at a glance.
*   **Enhanced Accessibility**: Implemented strict accessibility standards with improved contrast ratios and screen-reader friendly semantic HTML.
*   **Micro-Animations**: Leveraged `framer-motion` for smooth, staggered list entries, hover-state elevation, and fluid layout transitions that provide a premium feel.

### 🔐 Absolute Session Persistence
*   **Zero-Logout Refresh**: Implemented a robust multi-phase authentication restoration engine that ensures users and admins stay logged in across page refreshes, browser restarts, and tab closures.
*   **Atomic Auth Restoration**: Integrated a `loadingUser` guard that waits for Supabase to definitively resolve the session from local storage before rendering routes, eliminating the "flash" of logged-out content.
*   **Centralized Route Guards**: Introduced a unified `ProtectedRoute` component that preserves the destination URL during session restoration, preventing unwanted redirects to the home page.
*   **Debuggable Auth Flow**: Added comprehensive logging in the browser console for real-time monitoring of session rehydration and token synchronization.

### 📊 New Features
*   **Advanced Task Orchestration**: New task management system with status-based accent bars, interactive status switching, and priority-driven visualization.
*   **Role-Based Access Control (RBAC)**: Robust `user` and `admin` permission layers controlling access across the entire ecosystem.
*   **Real-time Synchronization**: Instant data parity between the User and Admin portals for application tracking, interview results, and work reporting.
*   **Professional Project Analytics**: Dedicated sidebar for project-specific health metrics, including percentage-based velocity tracking and status indicators.

---

## 🤖 AI Interview App Integration

The AI Interview application has been successfully integrated into the main `User` project, providing an end-to-end automated assessment workflow.

### Integration Details
1. **Frontend Consolidation**: The interview UI components (`ResumeUpload`, `Interview`, `Results`) were ported into the `User/src/Pages/AiInterview` directory.
2. **Contextual Authentication**: The system utilizes the `useAuthModal` context for seamless session mapping to the `w_users` table.

### Supabase Configuration Guide
To ensure the AI Interview app functions correctly, the following database and edge function configurations are required:

#### 1. Storage Buckets
Create a new public storage bucket specifically for the AI interview resumes:
*   **Bucket Name**: `Interview_Resumes`
*   **Public**: True
*   **Policies**: Add `INSERT`, `SELECT`, `UPDATE`, and `DELETE` policies for the authenticated roles.

#### 2. Database Schema (Foreign Keys & RLS)
The `interviews` table requires Row Level Security (RLS) configuration and a correct foreign key constraint linking to the User application's `w_users` table:
```sql
-- Fix the foreign key constraint to link with the User app's table
ALTER TABLE interviews DROP CONSTRAINT IF EXISTS interviews_user_id_fkey;
ALTER TABLE interviews ADD CONSTRAINT interviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES w_users(id) ON DELETE CASCADE;

-- Enable RLS and add policies
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all actions for authenticated users" ON public.interviews FOR ALL TO public USING (true) WITH CHECK (true);
```

#### 3. Edge Functions Deployment
The application relies on Supabase Edge Functions (`Interview_generate-questions` and `Interview_grade-interview`) to interface with Google's Gemini AI. Due to custom auth flows, these functions must be deployed bypassing default JWT verification routing:

```bash
# Navigate to the project root
cd "20260207 Kota-Vaishakh Final"

# Deploy functions
npx supabase functions deploy Interview_generate-questions --no-verify-jwt --project-ref uqkqewydjbqqiuezxnqk
npx supabase functions deploy Interview_grade-interview --no-verify-jwt --project-ref uqkqewydjbqqiuezxnqk
```

#### 4. Gemini API Configuration
The Edge Functions require a Google Gemini API Key. This must be stored securely in the Supabase Dashboard.

1. Go to your **Supabase Dashboard**.
2. Navigate to **Edge Functions** > **Secrets**.
3. Create a new secret exactly named: `GEMINI_API_KEY`.
4. Paste your AI Studio Gemini API Key as the value.

---

## 🔄 System Workflow

Here is how the system operates from end-to-end:

1.  **Authentication**:
    *   Users sign up or log in using **Email** or **Google OAuth**.
    *   Authentication is managed securely by Supabase Auth.

2.  **Profile Creation**:
    *   Upon first login, users complete their profile (Name, Phone, University).
    *   Data is stored in the `public.users` table.

3.  **Application Submission**:
    *   **Internships**: Users fill out a detailed form and upload their Resume (PDF). Usage of Edge Functions ensures validation.
    *   **Research**: Users propose research topics and request support.
    *   **Academic Projects**: Students submit project documentation for review.
    *   **Courses**: Users browse and enroll in available courses.

4.  **Admin Review**:
    *   Admins log in to the **Admin Dashboard**.
    *   They review submissions, download attached documents from Storage Buckets, and update application statuses (e.g., *Pending* → *Selected*).
    *   Admins can track intern performance, attendance, and feedback in real-time.

5.  **Status Updates & Intern Dashboard**:
    *   Users track live application status on the **My Page** dashboard.
    *   Upon selection, interns gain access to the **Professional Pro Workspace**, featuring real-time analytics, task orchestration, and work reporting synchronized with the Admin panel.
    *   Includes an interactive timeline of application events, admin remarks, and AI Interview performance scores.

#### 5. Performance & Admin Policies
To fix performance issues and grant Admin access to intern activity, run these scripts in the Supabase SQL Editor:
- `database/performance_optimization.sql`: Adds optimized indexes to key tables.
- `database/admin_access_policies.sql`: Grants Administrators permission to view and manage all intern activity.

---

## 📂 Project Structure

*   **[User](./User)**: The frontend application for users (students/applicants) to register, apply for programs, and track their application status.
*   **[Admin](./Admin)**: The frontend dashboard for administrators to review applications, manage courses, and oversee the system.
*   **[supabase](./supabase)**: Centralized backend configuration.
    *   **[sql](./supabase/sql)**: Database schemas (tables, RLS policies) and seed data.
    *   **[functions](./supabase/functions)**: Supabase Edge Functions for backend logic.

## 🛠️ Tech Stack

Both applications are built with a modern stack:

*   **Frontend**: React.js with Tailwind CSS
*   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **Runtime**: Node.js

## 🚀 Getting Started

To get started with either application, please navigate to their respective directories and follow the README instructions provided there.

*   [Go to User App Documentation](./User/README.md)
*   [Go to Admin App Documentation](./Admin/README.md)

