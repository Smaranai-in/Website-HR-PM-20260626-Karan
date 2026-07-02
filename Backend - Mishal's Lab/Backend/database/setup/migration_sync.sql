-- ==============================================================================
-- 🔄 DATABASE SYNC & MIGRATION SCRIPT
-- ==============================================================================
-- Use this script to synchronize data from "old" tables to the "new" schema 
-- required by the current User and Admin application versions.
-- ==============================================================================

-- 1. SYNC: Legacy 'users' to 'w_users'
-- If you have a 'users' table, move data to 'w_users' if missing.
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'users') THEN
        INSERT INTO public.w_users (id, name, email, role, profile_url, user_verify, created_at)
        SELECT id, name, email, COALESCE(role, 'client'), profile_url, COALESCE(user_verify, false), created_at
        FROM public.users
        ON CONFLICT (id) DO UPDATE SET
            role = EXCLUDED.role,
            user_verify = EXCLUDED.user_verify;
    END IF;
END $$;

-- 2. SYNC: Legacy 'internship_applications' to 'w_internship_applications'
-- Migrates data and maps old columns like 'is_select' to 'current_status'.
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'internship_applications') THEN
        INSERT INTO public.w_internship_applications (
            user_id, full_name, phone_number, email, 
            linkedin_profile, portfolio_url, github_url, 
            university, country, state, city, 
            program_type, branch, graduation_year, 
            is_student, is_working_professional, has_internship_exp,
            top_priority_role, availability, 
            start_week, end_week, start_time, end_time,
            current_status, current_sub_status, created_at
        )
        SELECT 
            user_id, full_name, phone_number, email, 
            linkedin_profile, portfolio_url, github_url, 
            university, country, state, city, 
            program_type, branch, graduation_year, 
            is_student, is_working_professional, has_internship_exp,
            top_priority_role, availability, 
            start_week, end_week, start_time, end_time,
            COALESCE(current_status, is_select, 'Applied'), 'Application Received', created_at
        FROM public.internship_applications
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 3. ENSURE ADMIN ROLE (Fix for "Unable to sign in as Admin")
-- Updates a specific user to admin role by email (replace with your email if needed).
-- OR you can find your ID in auth.users and run: UPDATE w_users SET role = 'admin' WHERE id = '...uuid...';
UPDATE public.w_users 
SET role = 'admin' 
WHERE email = 'admin@example.com'; -- <--- CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL

-- 4. ENSURE COLUMN CONSISTENCY IN ATTENDANCE
-- Renames 'status' to 'current_status' if it hasn't been done yet.
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='internship_attendance' AND column_name='status'
    ) THEN
        ALTER TABLE public.internship_attendance RENAME COLUMN status TO current_status;
    END IF;
END $$;

-- 5. FINAL CHECK: IF RLS IS MISSING FOR w_internship_applications
ALTER TABLE public.w_internship_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own application" ON public.w_internship_applications;
CREATE POLICY "Users can manage their own application" ON public.w_internship_applications 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Optional: Allow admins to see ALL applications
DROP POLICY IF EXISTS "Admins can see all applications" ON public.w_internship_applications;
CREATE POLICY "Admins can see all applications" ON public.w_internship_applications 
FOR SELECT TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.w_users WHERE id = auth.uid() AND role = 'admin')
);
