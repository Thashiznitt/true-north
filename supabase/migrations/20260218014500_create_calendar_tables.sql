-- Migration: Create Sacred Calendar and Zodiac Tables
-- Created: 2026-02-18

-- Sacred Calendar Table (Holiday defining)
CREATE TABLE IF NOT EXISTS sacred_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    month INTEGER NOT NULL, -- 1-indexed (1=Jan)
    day INTEGER NOT NULL,
    type TEXT DEFAULT 'general', -- 'general', 'Christian', 'Muslim', etc.
    prompt_insight TEXT, -- Custom AI prompt instructions for this day
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Zodiac Sign Insights (Mapping traits/stellar wisdom)
CREATE TABLE IF NOT EXISTS zodiac_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sign TEXT UNIQUE NOT NULL, -- 'Aries', 'Taurus', etc.
    start_month INTEGER NOT NULL,
    start_day INTEGER NOT NULL,
    end_month INTEGER NOT NULL,
    end_day INTEGER NOT NULL,
    traits TEXT[],
    stellar_prompt TEXT, -- Specific metaphors for AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed with initial data (based on previous hardcoded constants)
INSERT INTO sacred_calendar (name, month, day, type, prompt_insight) VALUES
('Valentine''s Day', 1, 14, 'general', 'Focus on divine love, heart-centered connections, and the beauty of human affection.'),
('Mother''s Day', 4, 10, 'general', 'Honor the nurturing energy of the Divine Feminine and the strength of maternal love.'),
('Father''s Day', 5, 21, 'general', 'Celebrate the protective and guiding spirit of fatherhood and divine strength.'),
('Boyfriends Day', 9, 3, 'general', 'Celebrate supportive partnerships and the blessing of companionship.'),
('Girlfriends Day', 7, 1, 'general', 'Celebrate the beauty of shared paths and deep emotional support.'),
('Siblings Day', 3, 10, 'general', 'Reflect on the lifelong bond of shared roots and familial harmony.'),
('Daughters Day', 8, 25, 'general', 'Cherish the legacy of love and the unfolding potential of the next generation.'),
('Sons Day', 8, 28, 'general', 'Celebrate the strength, courage, and future promise of our sons.'),
('Grandparents Day', 8, 8, 'general', 'Honor the wisdom of ancestors and the roots that nourish our spiritual growth.'),
('International Peace Day', 8, 21, 'general', 'Invoke global harmony and the stillness of the collective soul.'),
('Ramadan Starts', 2, 1, 'Muslim', 'A time for deeper reflection, fasting, and spiritual purification.'),
('Eid al-Fitr', 2, 30, 'Muslim', 'Celebrate the joy of completion and communal gratitude.'),
('Easter Sunday', 3, 20, 'Christian', 'Reflect on resurrection, hope, and the victory of light.'),
('Christmas Day', 11, 25, 'Christian', 'Celebrate the birth of hope and the miracle of divine presence.');

INSERT INTO zodiac_definitions (sign, start_month, start_day, end_month, end_day, stellar_prompt) VALUES
('Aries', 2, 21, 3, 19, 'Include metaphors of "first light", "pioneering flames", and "courageous beginnings".'),
('Taurus', 3, 20, 4, 20, 'Include metaphors of "fertile earth", "steady orbits", and "unshakable roots".'),
('Gemini', 4, 21, 5, 20, 'Include metaphors of "stellar twins", "dancing winds", and "celestial dialogue".'),
('Cancer', 5, 21, 6, 22, 'Include metaphors of "lunar tides", "protective shells", and "nested stars".'),
('Leo', 6, 23, 7, 22, 'Include metaphors of "solar radiance", "the heart of the sun", and "regal presence".'),
('Virgo', 7, 23, 8, 22, 'Include metaphors of "silver harvests", "meticulous patterns", and "hallowed ground".'),
('Libra', 8, 23, 9, 22, 'Include metaphors of "cosmic balance", "harmonious spheres", and "just scales".'),
('Scorpio', 9, 23, 10, 21, 'Include metaphors of "deep waters", "unseen depths", and "transformative fire".'),
('Sagittarius', 10, 22, 11, 21, 'Include metaphors of "stretching horizons", "galactic arrows", and "philosophical flight".'),
('Capricorn', 11, 22, 0, 19, 'Include metaphors of "stony heights", "ancient echoes", and "disciplined light".'),
('Aquarius', 0, 20, 1, 18, 'Include metaphors of "star-borne waters", "universal currents", and "visionary skies".'),
('Pisces', 1, 19, 2, 20, 'Include metaphors of "boundless oceans", "ethereal dreams", and "mystical union".');
-- Note: months are 0-indexed in JS but let's use 1-indexed for the SQL if we prefer, or align with JS. 
-- Above I used 1-indexed for sacred_calendar, so I'll stay consistent.
-- Adjusting zodiac to 1-indexed month:
UPDATE zodiac_definitions SET start_month = start_month + 1, end_month = end_month + 1;
-- Wait, Capricorn/Aquarius crossing year bounds. 0-index was easier for JS.
-- Let's stick to 1-indexed for clarity in DB.
UPDATE zodiac_definitions SET start_month = 12, end_month = 1 WHERE sign = 'Capricorn';
UPDATE zodiac_definitions SET start_month = 1, end_month = 2 WHERE sign = 'Aquarius';
UPDATE zodiac_definitions SET start_month = 2, end_month = 3 WHERE sign = 'Pisces';
UPDATE zodiac_definitions SET start_month = 3, end_month = 4 WHERE sign = 'Aries';
UPDATE zodiac_definitions SET start_month = 4, end_month = 5 WHERE sign = 'Taurus';
UPDATE zodiac_definitions SET start_month = 5, end_month = 6 WHERE sign = 'Gemini';
UPDATE zodiac_definitions SET start_month = 6, end_month = 7 WHERE sign = 'Cancer';
UPDATE zodiac_definitions SET start_month = 7, end_month = 8 WHERE sign = 'Leo';
UPDATE zodiac_definitions SET start_month = 8, end_month = 9 WHERE sign = 'Virgo';
UPDATE zodiac_definitions SET start_month = 9, end_month = 10 WHERE sign = 'Libra';
UPDATE zodiac_definitions SET start_month = 10, end_month = 11 WHERE sign = 'Scorpio';
UPDATE zodiac_definitions SET start_month = 11, end_month = 12 WHERE sign = 'Sagittarius';
