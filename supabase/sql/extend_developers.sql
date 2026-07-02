
-- Extend p_developers with additional metadata from User Dashboard
ALTER TABLE public.p_developers 
ADD COLUMN IF NOT EXISTS intern_id TEXT,
ADD COLUMN IF NOT EXISTS supervisor TEXT,
ADD COLUMN IF NOT EXISTS days_left INTEGER,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Unpaid Intern',
ADD COLUMN IF NOT EXISTS onboarding_progress INTEGER DEFAULT 0;

-- Create Onboarding Tasks Table
CREATE TABLE IF NOT EXISTS public.p_onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id TEXT NOT NULL REFERENCES public.p_developers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'action', 'verified')),
    action_label TEXT,
    action_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (developer_id, title)
);

ALTER TABLE public.p_onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- RBAC for onboarding tasks
CREATE POLICY "Privileged roles can manage onboarding"
ON public.p_onboarding_tasks
FOR ALL
TO authenticated
USING (
  exists (
    select 1 from public.w_users 
    where id = auth.uid() and role IN ('admin', 'hr', 'manager')
  )
);

CREATE POLICY "Developers can view own onboarding"
ON public.p_onboarding_tasks
FOR SELECT
TO authenticated
USING (auth.uid()::text = developer_id);
