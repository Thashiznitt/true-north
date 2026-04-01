-- Email logs table to prevent duplicate cron-triggered emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  email_type TEXT NOT NULL, -- 'inactivity' | 'circles_nudge' | 'welcome' | 'subscription_success' | 'payment_failed'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_user_type ON public.email_logs(user_id, email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert email logs"
  ON public.email_logs FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service can read email logs"
  ON public.email_logs FOR SELECT TO anon USING (true);
