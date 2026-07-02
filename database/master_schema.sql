-- ==============================================================================
-- 🚀 MASTER DATABASE SETUP FOR INTERNSHIP MANAGEMENT SYSTEM
-- ==============================================================================
-- This script contains all tables, policies, and buckets required for the project.
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 0. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE (w_users)
-- Links to auth.users for extended profile information.
CREATE TABLE IF NOT EXISTS public.w_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'client', -- 'client', 'intern', 'admin', 'supervisor'
    profile_url TEXT DEFAULT NULL,
    user_verify BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.w_users ENABLE ROW LEVEL SECURITY;

-- Policies for w_users
DROP POLICY IF EXISTS "Users can read all profiles" ON public.w_users;
CREATE POLICY "Users can read all profiles" ON public.w_users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.w_users;
CREATE POLICY "Users can update their own profile" ON public.w_users FOR UPDATE TO authenticated USING (auth.uid() = id);


-- 2. INTERNSHIP APPLICATIONS TABLE (w_internship_applications)
-- Stores applications and status tracking.
-- Note: Historically named both 'w_internship_applications' and 'w_internship_applications'.
-- The current codebase primarily targets 'w_internship_applications'.
CREATE TABLE IF NOT EXISTS public.w_internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    
    linkedin_profile TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    cv_url TEXT,
    
    university TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    
    program_type TEXT,
    branch TEXT,
    graduation_year TEXT,
    
    is_student BOOLEAN DEFAULT FALSE,
    is_working_professional BOOLEAN DEFAULT FALSE,
    has_internship_exp BOOLEAN DEFAULT FALSE,
    work_experience_desc TEXT,
    internship_exp_desc TEXT,
    
    top_priority_role TEXT,
    availability TEXT,
    
    start_week TEXT,
    end_week TEXT,
    start_time TIME,
    end_time TIME,
    
    interview_date DATE,
    available_to_join TEXT,
    
    current_status TEXT DEFAULT 'Applied', -- 'Applied', 'Under Review', 'Selected', 'Rejected', etc.
    current_sub_status TEXT DEFAULT 'Application Received',
    status_history JSONB DEFAULT '[]'::jsonb,
    
    review TEXT[],
    reviewtimestamp TEXT[],
    
    status_updated_at TIMESTAMPTZ,
    status_updated_by UUID REFERENCES auth.users(id),
    status_updated_role TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.w_internship_applications ENABLE ROW LEVEL SECURITY;

-- Policies for w_internship_applications
DROP POLICY IF EXISTS "Users can manage their own application" ON public.w_internship_applications;
CREATE POLICY "Users can manage their own application" ON public.w_internship_applications 
FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all applications" ON public.w_internship_applications;
CREATE POLICY "Admins can view all applications" ON public.w_internship_applications 
FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM w_users WHERE id = auth.uid() AND role = 'admin'));


-- 3. INTERNSHIP ATTENDANCE (internship_attendance)
CREATE TABLE IF NOT EXISTS public.internship_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    break_start TIMESTAMPTZ,
    break_end TIMESTAMPTZ,
    total_hours NUMERIC(4,2), -- Calculated field
    current_status TEXT DEFAULT 'offline', -- 'online', 'offline', 'on_break', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.internship_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own attendance" ON internship_attendance FOR ALL USING (auth.uid() = user_id);


-- 4. DAILY REPORTS (internship_daily_reports)
CREATE TABLE IF NOT EXISTS public.internship_daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    report_text TEXT NOT NULL,
    tasks_completed JSONB,
    blockers TEXT,
    hours_logged NUMERIC(4,2),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.internship_daily_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reports" ON internship_daily_reports FOR ALL USING (auth.uid() = user_id);


-- 5. NOTIFICATIONS (internship_notifications)
CREATE TABLE IF NOT EXISTS public.internship_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notif_type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.internship_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their notifications" ON internship_notifications FOR SELECT USING (auth.uid() = user_id);


-- 6. INTERN PROJECTS / TASKS (w_intern_projects)
CREATE TABLE IF NOT EXISTS public.w_intern_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    assigned_task TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Assigned', -- 'Assigned', 'In Progress', 'Completed'
    progress INTEGER DEFAULT 0,
    due_date DATE,
    weekly_update JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.w_intern_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interns can view their own projects" ON w_intern_projects FOR SELECT USING (auth.uid() = intern_id);


-- 7. LOG TABLES FOR AUDIT (Used in Edge Functions)
CREATE TABLE IF NOT EXISTS public.internship_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    action_type TEXT,
    old_status TEXT,
    new_status TEXT,
    old_sub_status TEXT,
    new_sub_status TEXT,
    remark_text TEXT,
    created_by UUID REFERENCES auth.users(id),
    actor_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internship_field_change_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID REFERENCES auth.users(id),
    change_role TEXT,
    change_reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);


-- 8. ACADEMIC & RESEARCH (w_academic_projects, w_research_enrollments)
CREATE TABLE IF NOT EXISTS public.w_academic_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.w_research_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    stage TEXT NOT NULL,
    description TEXT NOT NULL,
    support_needed TEXT NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COURSES (w_courses, w_course_enrollments)
CREATE TABLE IF NOT EXISTS public.w_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT NOT NULL,
    course_domain TEXT NOT NULL,
    description TEXT,
    course_level TEXT,
    how_many_weeks INTEGER,
    total_enrolled INTEGER DEFAULT 0,
    course_array TEXT[],
    course_week_array JSONB[],
    course_logo TEXT,
    course_fee NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.w_course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phno TEXT NOT NULL,
    course_id UUID REFERENCES w_courses(id),
    status TEXT DEFAULT 'enrolled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 10. CHAT SYSTEM (w_messages)
CREATE TABLE IF NOT EXISTS public.w_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reply_to_id UUID REFERENCES public.w_messages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'sent',
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    reactions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.w_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own chat" ON w_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);


-- 11. ASSESSMENTS (New Integration)
CREATE TABLE IF NOT EXISTS public.internship_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading TEXT NOT NULL,
    role TEXT NOT NULL,
    details TEXT,
    difficulty TEXT DEFAULT 'Intermediate',
    days INTEGER DEFAULT 3,
    hrs INTEGER,
    hasimage BOOLEAN DEFAULT FALSE,
    taskimage TEXT,
    isactive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internship_student_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    internship_application_id UUID REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    assessment_outline_id UUID REFERENCES internship_assessments(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned', -- 'assigned', 'submitted', 'reviewed'
    due_date TIMESTAMPTZ NOT NULL,
    submission_url TEXT,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 12. PERFORMANCE REVIEWS & TRAITS (Used in Admin Dashboard)
CREATE TABLE IF NOT EXISTS public.application_traits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    trait_id TEXT NOT NULL,
    notes TEXT,
    added_by UUID REFERENCES auth.users(id),
    actor_role TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internship_performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES w_internship_applications(id) ON DELETE CASCADE,
    review_period TEXT, -- 'Week 1', 'Mid-Term', 'Final'
    technical_rating NUMERIC(3,2),
    communication_rating NUMERIC(3,2),
    overall_rating NUMERIC(3,2),
    remarks TEXT,
    reviewer UUID REFERENCES auth.users(id),
    actor_role TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ================= STORAGE BUCKETS SETUP =================
-- Note: These MUST be created in the Supabase Dashboard -> Storage
-- Buckets to create:
-- 1. 'avatars' (Public: true)
-- 2. 'internship_resumes' (Public: false)
-- 3. 'academic_project_docs' (Public: false)
-- 4. 'research_documents' (Public: false)
-- 5. 'chat-images' (Public: true)
-- 6. 'chat-files' (Public: true)

-- Policies for storage can be found in storage.sql
