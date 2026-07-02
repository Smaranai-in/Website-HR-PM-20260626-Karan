
-- 1. interviews
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'interviews') THEN
        ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable all actions for authenticated users" ON public.interviews;
        DROP POLICY IF EXISTS "Candidates can manage their own interviews" ON public.interviews;
        DROP POLICY IF EXISTS "Admins can view and manage all interviews" ON public.interviews;
        
        CREATE POLICY "Candidates can manage their own interviews" ON public.interviews
        FOR ALL TO authenticated
        USING (auth.uid()::text = user_id::text)
        WITH CHECK (auth.uid()::text = user_id::text);
        
        CREATE POLICY "Admins can view and manage all interviews" ON public.interviews
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.w_users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
          )
        );
    END IF;
END $$;

-- 2. w_academic_projects
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'w_academic_projects') THEN
        ALTER TABLE public.w_academic_projects ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view all academic projects" ON public.w_academic_projects;
        CREATE POLICY "Admins can view all academic projects" ON public.w_academic_projects
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.w_users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
          )
        );
    END IF;
END $$;

-- 3. w_research_enrollments
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'w_research_enrollments') THEN
        ALTER TABLE public.w_research_enrollments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view all research enrollments" ON public.w_research_enrollments;
        CREATE POLICY "Admins can view all research enrollments" ON public.w_research_enrollments
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.w_users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
          )
        );
    END IF;
END $$;

-- 4. w_course_enrollments
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'w_course_enrollments') THEN
        ALTER TABLE public.w_course_enrollments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view all course enrollments" ON public.w_course_enrollments;
        CREATE POLICY "Admins can view all course enrollments" ON public.w_course_enrollments
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.w_users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
          )
        );
    END IF;
END $$;

-- 5. w_courses
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'w_courses') THEN
        ALTER TABLE public.w_courses ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Anyone can read courses" ON public.w_courses;
        CREATE POLICY "Anyone can read courses" ON public.w_courses FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Admins can manage courses" ON public.w_courses;
        CREATE POLICY "Admins can manage courses" ON public.w_courses FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 6. internship_activity_log
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_activity_log') THEN
        ALTER TABLE public.internship_activity_log ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view activity logs" ON public.internship_activity_log;
        CREATE POLICY "Admins can view activity logs" ON public.internship_activity_log FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 7. internship_field_change_log
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_field_change_log') THEN
        ALTER TABLE public.internship_field_change_log ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view field change logs" ON public.internship_field_change_log;
        CREATE POLICY "Admins can view field change logs" ON public.internship_field_change_log FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 8. internship_assessments
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_assessments') THEN
        ALTER TABLE public.internship_assessments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Authenticated users can read assessments outline" ON public.internship_assessments;
        CREATE POLICY "Authenticated users can read assessments outline" ON public.internship_assessments FOR SELECT TO authenticated USING (true);
        
        DROP POLICY IF EXISTS "Admins can manage assessments outline" ON public.internship_assessments;
        CREATE POLICY "Admins can manage assessments outline" ON public.internship_assessments FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 9. internship_student_assessments
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_student_assessments') THEN
        ALTER TABLE public.internship_student_assessments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own assessments" ON public.internship_student_assessments;
        CREATE POLICY "Users can manage own assessments" ON public.internship_student_assessments FOR ALL TO authenticated
        USING (auth.uid()::text = user_id::text)
        WITH CHECK (auth.uid()::text = user_id::text);
        
        DROP POLICY IF EXISTS "Admins can manage all student assessments" ON public.internship_student_assessments;
        CREATE POLICY "Admins can manage all student assessments" ON public.internship_student_assessments FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 10. application_traits
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'application_traits') THEN
        ALTER TABLE public.application_traits ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can manage application traits" ON public.application_traits;
        CREATE POLICY "Admins can manage application traits" ON public.application_traits FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin'));
    END IF;
END $$;

-- 11. internship_performance_reviews
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_performance_reviews') THEN
        ALTER TABLE public.internship_performance_reviews ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 12. STORAGE BUCKET 'Interview_Resumes' SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('Interview_Resumes', 'Interview_Resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for Interview_Resumes bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to Interview_Resumes" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to Interview_Resumes" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'Interview_Resumes');

DROP POLICY IF EXISTS "Allow users and admins to read Interview_Resumes" ON storage.objects;
CREATE POLICY "Allow users and admins to read Interview_Resumes" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'Interview_Resumes' 
  AND (
    owner::text = auth.uid()::text 
    OR EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin')
  )
);

DROP POLICY IF EXISTS "Allow admins to delete Interview_Resumes" ON storage.objects;
CREATE POLICY "Allow admins to delete Interview_Resumes" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'Interview_Resumes' 
  AND EXISTS (SELECT 1 FROM public.w_users WHERE id::text = auth.uid()::text AND role = 'admin')
);


