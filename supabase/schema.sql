  -- DUBS Database Schema
  -- Run this in your Supabase SQL editor

  -- Jobs table: tracks each translation/dubbing request
  CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,                          -- Clerk user ID
    youtube_url TEXT NOT NULL,
    video_id TEXT NOT NULL,
    video_title TEXT,
    source_language TEXT NOT NULL DEFAULT 'en',    -- source language (default English)
    target_language TEXT NOT NULL,                 -- desired output language code (e.g. "hi", "es")
    status TEXT NOT NULL DEFAULT 'pending',        -- pending | dubbing | done | failed
    elevenlabs_dubbing_id TEXT,                    -- ElevenLabs dubbing job ID
    error_message TEXT,
    audio_url TEXT,                                -- Supabase Storage public URL for dubbed audio
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Index for fetching jobs by user
  CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs(user_id);

  -- Auto-update updated_at on every row change
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

  -- Storage bucket for dubbed audio files
  -- Run this in the Supabase SQL editor:
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('dubbed-audio', 'dubbed-audio', true)
  ON CONFLICT (id) DO NOTHING;
