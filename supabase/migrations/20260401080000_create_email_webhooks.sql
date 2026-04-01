-- ─────────────────────────────────────────────────────────────────────────────
-- True North: Database Webhooks via pg_net triggers
-- Replaces manual Supabase Dashboard webhook setup
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure pg_net extension is enabled (Supabase enables it by default)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ─── 1. Welcome Email — fires on new user INSERT ─────────────────────────────

CREATE OR REPLACE FUNCTION notify_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://www.truenorth.you/api/welcome-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := json_build_object('record', row_to_json(NEW), 'type', 'INSERT')::text
  );
  RETURN NEW;
END;
$$;

-- Drop if exists so migration is idempotent
DROP TRIGGER IF EXISTS on_user_created ON public.users;

CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_created();

-- ─── 2. Subscription Email — fires on user UPDATE when tier changes ───────────

CREATE OR REPLACE FUNCTION notify_subscription_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only fire when subscription_tier actually changes
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    PERFORM net.http_post(
      url     := 'https://www.truenorth.you/api/subscription-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := json_build_object(
        'record',     row_to_json(NEW),
        'old_record', row_to_json(OLD),
        'type',       'UPDATE'
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_subscription_changed ON public.users;

CREATE TRIGGER on_subscription_changed
  AFTER UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_subscription_changed();
