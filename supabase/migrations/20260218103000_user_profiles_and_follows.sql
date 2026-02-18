-- Add privacy setting to user_preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS is_profile_private BOOLEAN DEFAULT FALSE;

-- Create follows table for social graph
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Create follow_requests table with expiration logic
CREATE TABLE IF NOT EXISTS follow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    UNIQUE(sender_id, receiver_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follow_requests_receiver ON follow_requests(receiver_id);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_requests ENABLE ROW LEVEL SECURITY;

-- Simple Policies (to be refined based on app logic)
CREATE POLICY "Users can see who they follow" ON follows FOR SELECT USING (auth.uid() = follower_id);
CREATE POLICY "Users can see their followers" ON follows FOR SELECT USING (auth.uid() = following_id);
CREATE POLICY "Users can manage their follow requests" ON follow_requests FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
