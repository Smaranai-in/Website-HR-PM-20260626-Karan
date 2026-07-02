-- ==============================================================================
-- 🚀 LEAVES AND DAILY REPORTS DB SETUP
-- ==============================================================================
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. CREATE LEAVES TABLE
CREATE TABLE IF NOT EXISTS public.w_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    attachment_url TEXT DEFAULT NULL,
    status TEXT DEFAULT 'Pending',
    remarks TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.w_leaves ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent duplication errors
DROP POLICY IF EXISTS "Users can manage their own leaves" ON public.w_leaves;
DROP POLICY IF EXISTS "Admins can manage all leaves" ON public.w_leaves;

-- Create Policies
CREATE POLICY "Users can manage their own leaves" ON public.w_leaves
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all leaves" ON public.w_leaves
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM w_users WHERE id = auth.uid() AND role = 'admin')
    );

-- 2. ALTER DAILY REPORTS TABLE
ALTER TABLE public.intern_daily_reports ADD COLUMN IF NOT EXISTS hours_logged NUMERIC(4,2);
ALTER TABLE public.intern_daily_reports ADD COLUMN IF NOT EXISTS blockers TEXT;
