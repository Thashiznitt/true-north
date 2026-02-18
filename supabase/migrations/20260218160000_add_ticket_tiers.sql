-- Create ticket_tiers table
CREATE TABLE IF NOT EXISTS public.ticket_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL DEFAULT 0,
    tickets_sold INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tier_id to tickets table
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES public.ticket_tiers(id) ON DELETE SET NULL;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tier_name TEXT;

-- Enable RLS for ticket_tiers
ALTER TABLE public.ticket_tiers ENABLE ROW LEVEL SECURITY;

-- Ticket Tiers Policies
CREATE POLICY "Ticket tiers are viewable by everyone" 
ON public.ticket_tiers FOR SELECT USING (true);

CREATE POLICY "Admins/Moderators can manage ticket tiers" 
ON public.ticket_tiers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.circle_members cm ON e.circle_id = cm.circle_id
        WHERE e.id = ticket_tiers.event_id 
        AND cm.user_id = auth.uid() 
        AND cm.role IN ('admin', 'moderator')
    )
);

-- Update tickets policies to include tier information access if needed
-- (Existing policies already cover select/update based on event ownership)

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_ticket_tiers_event_id ON public.ticket_tiers(event_id);
