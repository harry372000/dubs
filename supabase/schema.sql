-- DUBS Database Schema
-- Run this in your Supabase SQL editor

-- Jobs table: tracks each translation/dubbing request
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,                        -- Clerk user ID
  youtube_url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  video_title TEXT,
  source_language TEXT NOT NULL DEFAULT 'en',  -- detected source language
  target_language TEXT NOT NULL,               -- desired output language
  status TEXT NOT NULL DEFAULT 'pending',      -- pending | transcribing | translating | dubbing | done | failed
  error_message TEXT,
  audio_url TEXT,                              -- Supabase Storage URL for dubbed audio
  transcript JSONB,                            -- raw transcript segments with timestamps
  translated_transcript JSONB,                 -- translated segments with timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching jobs by user
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs(user_id);

-- Auto-update updated_at
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
-- Run this separately or via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('dubbed-audio', 'dubbed-audio', true);
