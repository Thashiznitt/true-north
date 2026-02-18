-- Add validator role support to tickets policies
-- This relies on the circle_members table having 'validator' as a role

-- Update Tickets select policy to include validators
DROP POLICY IF EXISTS "Admins/Moderators can view tickets for their circle events" ON public.tickets;
CREATE POLICY "Admins/Moderators/Validators can view tickets for their circle events"
ON public.tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.circle_members cm ON e.circle_id = cm.circle_id
        WHERE e.id = tickets.event_id 
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'moderator', 'validator')
    )
);

-- Update Tickets update policy to include validators
DROP POLICY IF EXISTS "Admins/Moderators can update ticket status" ON public.tickets;
CREATE POLICY "Admins/Moderators/Validators can update ticket status"
ON public.tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.circle_members cm ON e.circle_id = cm.circle_id
        WHERE e.id = tickets.event_id 
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'moderator', 'validator')
    )
);

-- Note: circle_members.role already accepts any text, so no schema change needed there.
-- Just ensuring policies recognize the 'validator' role.
