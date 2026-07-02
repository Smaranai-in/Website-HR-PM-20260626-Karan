-- ==============================================================================
-- 🔐 ADMIN ACCESS POLICIES FOR INTERNSHIP ACTIVITY
-- ==============================================================================
-- Run this in your Supabase SQL Editor to allow Admins to view all intern data.
-- ==============================================================================

-- 1. ATTENDANCE TABLE ACCESS
DROP POLICY IF EXISTS "Admins can view all attendance" ON public.internship_attendance;
CREATE POLICY "Admins can view all attendance" ON public.internship_attendance
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. DAILY REPORTS TABLE ACCESS
DROP POLICY IF EXISTS "Admins can view all reports" ON public.internship_daily_reports;
CREATE POLICY "Admins can view all reports" ON public.internship_daily_reports
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. INTERN PROJECTS / TASKS ACCESS
DROP POLICY IF EXISTS "Admins can view all projects" ON public.w_intern_projects;
CREATE POLICY "Admins can view all projects" ON public.w_intern_projects
FOR ALL TO authenticated -- Admins can also assign/update
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. MESSAGES ACCESS (If needed for supervisor support)
DROP POLICY IF EXISTS "Admins can view support messages" ON public.w_messages;
CREATE POLICY "Admins can view support messages" ON public.w_messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. PERFORMANCE REVIEWS ACCESS
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.internship_performance_reviews;
CREATE POLICY "Admins can manage all reviews" ON public.internship_performance_reviews
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
