-- Migration to seed Apple Review User
-- User: apple-review@truenorth.app
-- Password: ReviewPassword123!

BEGIN;

DO $$
DECLARE
    v_user_id uuid := 'b78d8d12-a5b6-4bc4-a37e-e4235ba2ae5b';
    v_email text := 'apple-review@truenorth.app';
    v_password_hash text := '$2b$10$m0H/O9eGUmX7bRG5wDp2QewMCPXoTZ7WXI1Wl0qf4xkwOFiw45GTq';
BEGIN

    -- 1. Insert into auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            v_email,
            v_password_hash,
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    ELSE
        -- If user exists, get the ID (in case it's different)
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
        -- Optional: Update password if needed
        UPDATE auth.users SET encrypted_password = v_password_hash, email_confirmed_at = NOW() WHERE id = v_user_id;
    END IF;

    -- 2. Insert into auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        v_user_id,
        format('{"sub": "%s", "email": "%s"}', v_user_id, v_email)::jsonb,
        'email',
        v_user_id,
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (provider, provider_id) DO NOTHING;

    -- 3. Insert into public.users
    INSERT INTO public.users (
        id,
        email,
        username,
        role,
        subscription_tier,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        v_email,
        'Apple Reviewer',
        'member',
        'free',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        subscription_tier = 'free';

    -- 4. Insert into public.user_preferences
    INSERT INTO public.user_preferences (
        user_id,
        belief_type,
        themes,
        is_onboarded,
        biometrics_enabled,
        notifications_enabled,
        notification_time
    ) VALUES (
        v_user_id,
        'Christian',
        ARRAY['Faith', 'Peace'],
        TRUE,
        FALSE,
        FALSE,
        '07:30'
    ) ON CONFLICT (user_id) DO UPDATE SET
        is_onboarded = TRUE;

    -- 5. Insert into public.user_goals
    INSERT INTO public.user_goals (
        user_id,
        daily_reflection,
        morning_devotion,
        spirituality,
        health
    ) VALUES (
        v_user_id,
        TRUE,
        TRUE,
        'Grow closer to God',
        'Walk daily'
    ) ON CONFLICT (user_id) DO NOTHING;

END $$;

COMMIT;
