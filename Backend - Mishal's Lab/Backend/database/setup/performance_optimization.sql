-- ==============================================================================
-- ⚡ DATABASE PERFORMANCE OPTIMIZATION
-- ==============================================================================
-- Run these commands in your Supabase SQL Editor to speed up your Admin Dashboard.
-- These create INDEXES that allow the database to find user data instantly.
-- ==============================================================================

-- 1. Index for Attendance (Speeds up Activity Page & User Detail)
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.internship_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.internship_attendance(date DESC);

-- 2. Index for Daily Reports (Speeds up Activity Page & User Detail)
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.internship_daily_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_at ON public.internship_daily_reports(submitted_at DESC);

-- 3. Index for Internship Applications (Speeds up the main list)
CREATE INDEX IF NOT EXISTS idx_apps_user_id ON public.w_internship_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.w_internship_applications(current_status);

-- 4. Index for Projects/Tasks
CREATE INDEX IF NOT EXISTS idx_projects_intern_id ON public.w_intern_projects(intern_id);

-- 5. Index for AI Interviews (If table exists)
-- CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
