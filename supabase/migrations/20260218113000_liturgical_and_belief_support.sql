-- Migration: Add Belief System and Liturgical Support
-- Created: 2026-02-18

-- Add fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS belief_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS liturgical_calendar_enabled BOOLEAN DEFAULT FALSE;

-- Add fields to user_preferences table (if not already there)
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS liturgical_calendar_enabled BOOLEAN DEFAULT FALSE;
-- belief_type already exists in user_preferences from init.sql

-- Update sacred_calendar to support specific years (for movable feasts)
ALTER TABLE sacred_calendar ADD COLUMN IF NOT EXISTS year INTEGER;

-- Seed Catholic specific dates for 2026
-- Delete existing seed data for movable feasts if any were added manually
DELETE FROM sacred_calendar WHERE name IN ('Ash Wednesday', 'Easter Sunday', 'Pentecost Sunday', 'Assumption of Mary', 'All Saints Day', 'Immaculate Conception') AND year = 2026;

INSERT INTO sacred_calendar (name, month, day, year, type, prompt_insight) VALUES
('Ash Wednesday', 2, 18, 2026, 'Catholic', 'Begin the season of Lent with reflection, penance, and spiritual renewal.'),
('Easter Sunday', 4, 5, 2026, 'Catholic', 'Celebrate the resurrection of Jesus and the promise of eternal life.'),
('Pentecost Sunday', 5, 24, 2026, 'Catholic', 'Celebrate the descent of the Holy Spirit upon the Apostles.'),
('Assumption of Mary', 8, 15, 2026, 'Catholic', 'Honor the Assumption of the Blessed Virgin Mary into heaven.'),
('All Saints Day', 11, 1, 2026, 'Catholic', 'Honor all the saints, known and unknown.'),
('Immaculate Conception', 12, 8, 2026, 'Catholic', 'Celebrate the conception of the Blessed Virgin Mary without sin.');
