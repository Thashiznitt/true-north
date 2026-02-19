-- Enable RLS on users table (idempotent)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
-- This is critical for the signup/login flow where the profile is created
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Public profiles: Allow everyone to view basic user info
-- Adjust this based on your privacy requirements. 
-- For now, allowing authenticated users to view all profiles is common for social apps.
CREATE POLICY "Authenticated users can view other profiles"
ON users FOR SELECT
USING (auth.role() = 'authenticated');


-- Policies for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own preferences"
ON user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences"
ON user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON user_preferences FOR UPDATE
USING (auth.uid() = user_id);


-- Policies for user_goals
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own goals"
ON user_goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
ON user_goals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
ON user_goals FOR UPDATE
USING (auth.uid() = user_id);
