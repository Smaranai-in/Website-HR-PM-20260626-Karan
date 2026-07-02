-- 1. Create the storage bucket for resumes
-- Note: If this fails with a permission error, please create the bucket
-- named 'internship_resumes' manually in the Supabase Dashboard (Storage section).
INSERT INTO storage.buckets (id, name, public)
VALUES ('internship_resumes', 'internship_resumes', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create policies for 'internship_resumes' bucket
-- (Note: RLS is usually already enabled on storage.objects in Supabase)

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to view all resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own resumes" ON storage.objects;

-- Policy: Authenticated users can upload files to their own folder (user_id)
CREATE POLICY "Allow authenticated users to upload resumes" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'internship_resumes' 
    AND name LIKE auth.uid()::text || '/%'
);

-- Policy: Users can see their own files
CREATE POLICY "Allow users to view their own resumes" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'internship_resumes' 
    AND name LIKE auth.uid()::text || '/%'
);

-- Policy: Admins can see ALL files in the 'internship_resumes' bucket
CREATE POLICY "Allow admins to view all resumes" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'internship_resumes' 
    AND (
        SELECT role FROM public.w_users WHERE id = auth.uid()
    ) = 'admin'
);

-- Policy: Users can delete their own files
CREATE POLICY "Allow users to delete their own resumes" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'internship_resumes' 
    AND name LIKE auth.uid()::text || '/%'
);
