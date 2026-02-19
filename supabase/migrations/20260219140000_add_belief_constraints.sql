-- Migration: Add check constraints for belief_types to ensure data integrity
-- Created: 2026-02-19

-- Update users table to add check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_belief_type_check;
ALTER TABLE users ADD CONSTRAINT users_belief_type_check 
CHECK (belief_type IN ('Catholic', 'Protestant', 'Christian', 'Muslim', 'Spiritual', 'Sikh', 'Hindu', 'Buddhist', 'Jewish', 'Secular', 'Exploring', 'Open'));

-- Update user_preferences table to add check constraint
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS user_preferences_belief_type_check;
ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_belief_type_check 
CHECK (belief_type IN ('Catholic', 'Protestant', 'Christian', 'Muslim', 'Spiritual', 'Sikh', 'Hindu', 'Buddhist', 'Jewish', 'Secular', 'Exploring', 'Open'));

-- Comment explaining the allowed values
COMMENT ON COLUMN users.belief_type IS 'Belief type: Catholic, Protestant, Christian, Muslim, Spiritual, Sikh, Hindu, Buddhist, Jewish, Secular, Exploring, Open';
COMMENT ON COLUMN user_preferences.belief_type IS 'Belief type: Catholic, Protestant, Christian, Muslim, Spiritual, Sikh, Hindu, Buddhist, Jewish, Secular, Exploring, Open';
