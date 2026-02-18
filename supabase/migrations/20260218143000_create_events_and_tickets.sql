-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    location TEXT,
    price NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    capacity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'used', 'cancelled')),
    qr_code TEXT, -- Unique string for QR generation
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_circle_id ON public.events(circle_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Admins/Moderators can insert events" 
ON public.events FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.circle_members 
        WHERE circle_id = events.circle_id 
        AND user_id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Admins/Moderators can update events" 
ON public.events FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.circle_members 
        WHERE circle_id = events.circle_id 
        AND user_id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Admins/Moderators can delete events" 
ON public.events FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.circle_members 
        WHERE circle_id = events.circle_id 
        AND user_id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Tickets Policies
CREATE POLICY "Users can view their own tickets"
ON public.tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins/Moderators can view tickets for their circle events"
ON public.tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.circle_members cm ON e.circle_id = cm.circle_id
        WHERE e.id = tickets.event_id 
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Users can insert their own tickets"
ON public.tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins/Moderators can update ticket status"
ON public.tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.circle_members cm ON e.circle_id = cm.circle_id
        WHERE e.id = tickets.event_id 
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'moderator')
    )
);
