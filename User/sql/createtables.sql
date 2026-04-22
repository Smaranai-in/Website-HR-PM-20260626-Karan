 -- #####      client or users databse query   #########

create table if not exists w_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text default 'client',
  profile_url text default null,
  user_verify boolean default false,
  created_at timestamp default now()
);

alter table w_users enable row level security;

CREATE POLICY "Users can insert their own profile"
ON public.w_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own profile"
ON public.w_users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Users can update their own profile"
ON public.w_users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);


--#### Intenship application database query    #######

create table w_internship_applications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete cascade,

  full_name text not null,
  phone_number text not null,
  email text not null,

  linkedin_profile text,
  portfolio_url text,
  github_url text,

  university text,
  country text,
  state text,
  city text,

  program_type text,
  branch text,
  graduation_year text,

  is_student boolean default false,
  is_working_professional boolean default false,
  has_internship_exp boolean default false,

  work_experience_desc text,
  internship_exp_desc text,

  top_priority_role text,
  availability text,

  start_week text,
  end_week text,
  start_time time,
  end_time time,

  interview_date date,
  available_to_join text,

  cv_url text,

   is_select text,              -- example: Pending / Completed / Selected
  review text[],               -- ARRAY["nm,.","rtyuiokjh"]
  reviewtimestamp text[] ,

  created_at timestamp with time zone default now()
);

alter table w_internship_applications enable row level security;

create policy "Users can insert their own intern application"
on w_internship_applications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can read their own intern application"
on w_internship_applications
for select
to authenticated
using (auth.uid() = user_id);


--#####  courses    ########

CREATE TABLE public.w_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  course_name text NOT NULL,
  course_domain text NOT NULL,
  description text,
  course_level text,
  how_many_weeks integer,
  total_enrolled integer DEFAULT 0,

  -- Simple text array
  course_array text[],

  -- JSON array for weekly structure
  course_week_array jsonb[],

  course_logo text,
  domain_id uuid,

  courseFee numeric(10,2),

  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.w_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses"
ON public.w_courses
FOR SELECT
TO authenticated
USING (true);



CREATE TABLE public.w_academic_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

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
  created_at TIMESTAMPTZ DEFAULT now()
);


ALTER TABLE public.w_academic_projects ENABLE ROW LEVEL SECURITY;

-- INSERT
CREATE POLICY "Users can insert their own academic projects data"
ON public.w_academic_projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- READ
CREATE POLICY "Users can read their own academic projects data"
ON public.w_academic_projects
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


CREATE TABLE public.w_research_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  country TEXT,
  state TEXT,
  city TEXT,
  college TEXT,
  grad_year TEXT,
  role TEXT,

  topic TEXT NOT NULL,
  stage TEXT NOT NULL,
  description TEXT NOT NULL,
  support_needed TEXT NOT NULL,

  document_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.w_research_enrollments ENABLE ROW LEVEL SECURITY;

-- INSERT
CREATE POLICY "Users can insert their own research data"
ON public.w_research_enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- READ
CREATE POLICY "Users can read their own research data"
ON public.w_research_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


CREATE TABLE public.w_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phno TEXT NOT NULL,

  city TEXT,
  state TEXT,
  country TEXT,

  college_university TEXT,
  degree_program TEXT,
  year_of_study TEXT,
  field_of_study TEXT,
  prior_experience TEXT,
  how_did_you_hear_about_us TEXT,
  reason_for_taking_course TEXT,

  course_id UUID,
  status TEXT DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.w_course_enrollments ENABLE ROW LEVEL SECURITY;


-- INSERT
CREATE POLICY "Users can insert their own research data"
ON public.w_course_enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- READ
CREATE POLICY "Users can read their own research data"
ON public.w_course_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


create table public.w_intern_projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  intern_id uuid not null, -- Links to the applicant/intern
  project_name text not null,
  assigned_task text not null,
  weekly_update JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.w_intern_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own projects
CREATE POLICY "Users can read own projects"
ON public.w_intern_projects
FOR SELECT
TO authenticated
USING (auth.uid() = intern_id);

-- Policy: Admins can do everything
CREATE POLICY "Admins can do everything on projects"
ON public.w_intern_projects
FOR ALL
TO authenticated
USING (
  exists (
    select 1 from public.w_users 
    where id = auth.uid() and role = 'admin'
  )
);



