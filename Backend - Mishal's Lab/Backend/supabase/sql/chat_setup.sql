-- ============================================================
-- CHAT SETUP SQL — Run this entire script in Supabase SQL Editor
-- ============================================================


-- ##### 1. Support Chat Messages (w_messages) #####
CREATE TABLE IF NOT EXISTS public.w_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_to_id UUID REFERENCES public.w_messages(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent',
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.w_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.w_messages;
DROP POLICY IF EXISTS "Users can read their own messages" ON public.w_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.w_messages;

CREATE POLICY "Users can insert their own messages"
ON public.w_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can read their own messages"
ON public.w_messages FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can update their own messages"
ON public.w_messages FOR UPDATE TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);


-- ##### 2. Fix w_users policies so:
--    a) Any authenticated user can read the admin row (to find admin ID)
--    b) Admins can read ALL user profiles (to list them in the sidebar)

DROP POLICY IF EXISTS "Users can read their own profile" ON public.w_users;
DROP POLICY IF EXISTS "Users can read own or admin profile" ON public.w_users;
DROP POLICY IF EXISTS "Users can read own profile or admin profile" ON public.w_users;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.w_users;

-- Simple policy: all authenticated users can read all profiles
-- (Safe — only name, email, role, profile_url are exposed)
CREATE POLICY "Authenticated users can read all profiles"
ON public.w_users FOR SELECT TO authenticated
USING (true);


-- ##### 3. Storage buckets for chat file uploads #####
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload chat-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read chat-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload chat-files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read chat-files" ON storage.objects;

CREATE POLICY "Authenticated users can upload chat-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-images');

CREATE POLICY "Anyone can read chat-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chat-images');

CREATE POLICY "Authenticated users can upload chat-files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Anyone can read chat-files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chat-files');
