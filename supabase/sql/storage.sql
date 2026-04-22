--Bucket name for Profile_Image : avatars

-- Allow authenticated users to upload
create policy "Allow authenticated uploads"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- Allow authenticated users to read
create policy "Allow authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'avatars');


--bucket name for Resumes : internship_resumes

create policy "Users can upload their own intern resume"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'internship_resumes'
  
);

create policy "Users can read their own intern resume"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'internship_resumes'
  
);

--bucket name for Resumes : academic project docs

CREATE POLICY "Users can upload their academic projects documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'academic_project_docs'
  
);

CREATE POLICY "Users can read their bucket data academic projects documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'academic_project_docs'
 
);

--bucket name for Resumes : research docs

CREATE POLICY "Users can upload their research documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'research_documents'
  
);

CREATE POLICY "Users can upload read their research documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'research_documents'
 
);
