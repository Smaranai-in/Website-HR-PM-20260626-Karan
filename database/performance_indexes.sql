-- ==============================================================================
-- ⚡ PERFORMANCE OPTIMIZATION: DATABASE INDEXES
-- ==============================================================================
-- Run these in your Supabase SQL Editor to fix slow dashboard loading.
-- Indexes significantly speed up 'WHERE' and 'JOIN' operations.
-- ==============================================================================

-- 1. Users & Applications
CREATE INDEX IF NOT EXISTS idx_w_users_role ON public.w_users(role);
CREATE INDEX IF NOT EXISTS idx_w_internship_apps_user_id ON public.w_internship_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_w_internship_apps_status ON public.w_internship_applications(current_status);

-- 2. Attendance & Reports (Heavy tables)
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.internship_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.internship_attendance(date);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.internship_daily_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON public.internship_daily_reports(date);

-- 3. Assessments (The recently problematic area)
CREATE INDEX IF NOT EXISTS idx_student_assessments_user_id ON public.internship_student_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_app_id ON public.internship_student_assessments(internship_application_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_outline_id ON public.internship_student_assessments(assessment_outline_id);

-- 4. Projects & Tasks
CREATE INDEX IF NOT EXISTS idx_intern_projects_user_id ON public.w_intern_projects(intern_id);
CREATE INDEX IF NOT EXISTS idx_intern_projects_status ON public.w_intern_projects(status);

-- 5. Notifications & Communication
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.internship_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.internship_notifications(user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.w_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.w_messages(receiver_id);

-- 6. Performance & Reviews
CREATE INDEX IF NOT EXISTS idx_app_traits_app_id ON public.application_traits(application_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_app_id ON public.internship_performance_reviews(application_id);

-- 7. Courses
CREATE INDEX IF NOT EXISTS idx_course_enroll_user_id ON public.w_course_enrollments(user_id);

-- ==============================================================================
-- ✅ SUCCESS: Indexes applied. Dashboard should now load significantly faster.
-- ==============================================================================
