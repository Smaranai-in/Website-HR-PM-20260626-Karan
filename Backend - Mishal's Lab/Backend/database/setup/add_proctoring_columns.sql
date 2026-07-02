-- ==============================================================================
-- PROCTORING ENHANCEMENT: Add face visibility tracking columns to interviews table
-- ==============================================================================
-- Run this in your Supabase SQL Editor.
-- These columns support the new warning-based face visibility detection system.
-- ==============================================================================

ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS face_missing_duration INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS face_visibility_warnings INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS camera_disconnected_events JSONB DEFAULT '[]'::jsonb;

-- Add a comment for documentation
COMMENT ON COLUMN public.interviews.face_missing_duration IS 'Total seconds the candidate face/camera was not visible during the interview';
COMMENT ON COLUMN public.interviews.face_visibility_warnings IS 'Number of face visibility warning violations (triggered at 10-30s intervals)';
COMMENT ON COLUMN public.interviews.camera_disconnected_events IS 'JSON array of camera disconnect/reconnect events with timestamps';
