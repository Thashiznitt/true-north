import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

const REVIEW_USER = {
    email: 'apple-review@truenorth.app',
    password: 'ReviewPassword123!',
    username: 'Apple Reviewer',
};

async function main() {
    console.log('🌱 Starting seed for Apple Review Account...');

    try {
        // 1. Check if user exists in auth.users (via Supabase Auth API - limited, so we try to sign in or just sign up)
        // We'll try to sign up. If it fails because it exists, we'll try to sign in to get the ID.

        let userId: string | null = null;
        let isNewUser = false;

        console.log(`Attempting to create/get user: ${REVIEW_USER.email}`);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: REVIEW_USER.email,
            password: REVIEW_USER.password,
        });

        if (signUpData.user) {
            userId = signUpData.user.id;
            isNewUser = true;
            console.log('User created via Auth API.');
        } else if (signUpError && signUpError.message.includes('already registered')) {
            console.log('User already exists, attempting login to get ID...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: REVIEW_USER.email,
                password: REVIEW_USER.password,
            });

            if (signInError) {
                throw new Error(`Could not sign in existing user: ${signInError.message}`);
            }
            if (signInData.user) {
                userId = signInData.user.id;
                console.log('User logged in successfully.');
            }
        } else if (signUpError) {
            throw new Error(`SignUp failed: ${signUpError.message}`);
        }

        if (!userId) {
            throw new Error('Failed to obtain User ID.');
        }

        console.log(`User ID: ${userId}`);

        // 2. Confirm Email (Direct DB Update) using Prisma
        // We need to use $executeRawUnsafe because auth schema is not in Prisma schema by default usually,
        // AND we want to make sure it's confirmed.
        console.log('Confirming email in auth.users...');
        // Note: Prisma usually connects to 'public' schema, so we need to reference auth.users explicitly if possible,
        // or use a separate connection string if the user allows it. 
        // The provided DATABASE_URL connects to 'postgres' database with 'postgres' user, so it should have permissions.

        await prisma.$executeRawUnsafe(`
        UPDATE auth.users 
        SET email_confirmed_at = NOW(), confirmed_at = NOW() 
        WHERE id = '${userId}';
    `);

        // 3. Create/Update Public User Profile
        console.log('Upserting public user profile...');
        await prisma.user.upsert({
            where: { id: userId },
            update: {
                email: REVIEW_USER.email,
                username: REVIEW_USER.username,
                role: 'member',
                subscriptionTier: 'free',
            },
            create: {
                id: userId,
                email: REVIEW_USER.email,
                username: REVIEW_USER.username,
                role: 'member',
                subscriptionTier: 'free',
            }
        });

        // 4. Create/Update Preferences (Onboarded = true)
        console.log('Upserting user preferences...');
        await prisma.userPreference.upsert({
            where: { userId: userId },
            update: {
                isOnboarded: true,
                notificationsEnabled: false, // Don't want real notifications for review bot
            },
            create: {
                userId: userId,
                beliefType: 'Christian', // Default
                themes: ['Faith', 'Peace'],
                isOnboarded: true,
                notificationsEnabled: false,
            }
        });

        // 5. Create/Update Goals
        console.log('Upserting user goals...');
        await prisma.userGoal.upsert({
            where: { userId: userId },
            update: {},
            create: {
                userId: userId,
                spirituality: 'Grow closer to God',
                health: 'Walk daily',
            }
        });

        console.log('✅ Seed complete! Apple Review Account ready.');
        console.log(`Email: ${REVIEW_USER.email}`);
        console.log(`Password: ${REVIEW_USER.password}`);

    } catch (e) {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
