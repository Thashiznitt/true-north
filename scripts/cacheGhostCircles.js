const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function cacheDailyReflections() {
    console.log('Starting daily AI reflection pre-caching...');

    try {
        // Fetch all active circles (or a subset for the day)
        const circles = await prisma.circle.findMany({
            where: {
                // Logic for circles that need reflections today
            }
        });

        console.log(`Found ${circles.length} circles to process.`);

        const today = new Date().toISOString().split('T')[0];

        for (const circle of circles) {
            const cacheKey = `reflection:${circle.id}:${today}`;

            // Check if already cached to avoid double spending tokens
            const exists = await redis.exists(cacheKey);
            if (exists) {
                console.log(`Skipping ${circle.id} - already cached.`);
                continue;
            }

            // Generate reflection (logic would call Gemini)
            const reflection = await generateAI(circle);

            // Store in Redis with 24h+ TTL
            await redis.set(cacheKey, JSON.stringify(reflection), 'EX', 90000); // 25 hours to ensure availability

            console.log(`Cached reflection for circle ${circle.id}`);
        }

        console.log('Daily caching completed successfully.');
    } catch (error) {
        console.error('Caching Process Failed:', error);
    } finally {
        await prisma.$disconnect();
        await redis.quit();
        process.exit(0);
    }
}

async function generateAI(circle) {
    // This is where Gemini 2.0 Flash would be called
    return {
        text: `Reflection for ${circle.name}: Trust the process.`,
        verse: "Jeremiah 29:11",
        action: "Write down one thing you are grateful for today."
    };
}

cacheDailyReflections();
