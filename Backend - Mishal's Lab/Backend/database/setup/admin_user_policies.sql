-- ==============================================================================
-- 🔐 SECURITY POLICIES FOR USER MANAGEMENT (w_users)
-- ==============================================================================
-- Run this in your Supabase SQL Editor to allow Admins to manage all user roles.
-- ==============================================================================

-- 1. Enable Row Level Security (Safety Check)
ALTER TABLE public.w_users ENABLE ROW LEVEL SECURITY;

-- 2. Allow Admins to update user profiles (including roles)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.w_users;
CREATE POLICY "Admins can update all profiles" ON public.w_users
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.w_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
