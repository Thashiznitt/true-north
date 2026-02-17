-- Migration: Add Personalization Fields (DOB and Astrology)
-- Created: 2026-02-18

-- Add fields to users table (Profile)
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS astrology_enabled BOOLEAN DEFAULT FALSE;

-- Add fields to user_preferences table (Settings)
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS astrology_enabled BOOLEAN DEFAULT FALSE;
