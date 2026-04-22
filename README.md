# User Application Management System

Welcome to the **User Application Management System** repository. This project is a comprehensive solution for managing internship, research, and academic project applications. It is divided into two main components: a User-facing application and an Admin dashboard.

## 🌟 Key Updates & Enhancements

This project has undergone significant improvements to enhance user experience, security, and developer productivity:

### 🎨 UI/UX Overhaul
*   **Modern Light Theme**: Switched to a clean, high-contrast light theme for better readability and professional aesthetics.
*   **Enhanced Accessibility**: Improved text contrast ratios (dark text on light backgrounds) across all pages.
*   **Responsive Design**: Refined layouts to ensure seamless usage across different screen sizes.

### ⚡ Backend & Security
*   **Supabase Edge Functions**: Migrated server-side logic to Supabase Edge Functions for better performance and security.
*   **Row Level Security (RLS)**: Implemented strict RLS policies to ensure users can only access their own data, while Admins have full oversight.
*   **Secure Storage**: Configured public storage buckets with specific policies for resumes, project documents, and profile avatars.

### 📊 New Features
*   **Role-Based Access Control (RBAC)**: Distinct `user` and `admin` roles to control access to the dashboard.

---

## 🤖 AI Interview App Integration

The AI Interview application has been successfully integrated into the main `User` project from its previously standalone architecture.

### Integration Details
1. **Frontend Consolidation**: The interview UI components (`ResumeUpload`, `Interview`, `Results`) were ported into the `User/src/Pages/AiInterview` directory.
2. **Contextual Authentication**: The standalone login system was removed. The application now seamlessly utilizes the User project's existing `useAuthModal` context for session management and user identities mapping to the `w_users` table.

### Supabase Configuration Guide
To ensure the AI Interview app functions correctly, the following database and edge function configurations are required:

#### 1. Storage Buckets
Create a new public storage bucket specifically for the AI interview resumes:
*   **Bucket Name**: `Interview_Resumes`
*   **Public**: True
*   **Policies**: Add `INSERT`, `SELECT`, `UPDATE`, and `DELETE` policies for the authenticated roles, or public policies depending on your usage.

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
The Edge Functions require a Google Gemini API Key. This must be stored securely in the Supabase Dashboard, **not** via environment variables in the React app.

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
    *   **Internships**: Users fill out a detailed form and upload their Resume (PDF). usage of Edge Functions ensures validation.
    *   **Research**: Users propose research topics and request support.
    *   **Academic Projects**: Students submit project documentation for review.
    *   **Courses**: Users browse and enroll in available courses.

4.  **Admin Review**:
    *   Admins log in to the **Admin Dashboard**.
    *   They review submissions, download attached documents from Storage Buckets, and update application statuses (e.g., *Pending* → *Selected*).

5.  **Status Updates & AI Interviews**:
    *   Users can track the live status of their applications on their dedicated **My Page** dashboard.
    *   This includes an interactive timeline of application events, admin remarks, and direct access to their AI Interview results and performance scores.

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

