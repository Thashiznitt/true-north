const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        await redis.ping();
        res.status(200).json({ status: 'ok', database: 'connected', redis: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Spiritual Intelligence / Ghost Circle Endpoint
app.post('/api/ghost-circle/reflection', async (req, res) => {
    const { circleId, date } = req.body;

    if (!circleId) return res.status(400).json({ error: 'circleId is required' });

    const cacheKey = `reflection:${circleId}:${date || new Date().toISOString().split('T')[0]}`;

    try {
        // Check cache first
        const cachedReflection = await redis.get(cacheKey);
        if (cachedReflection) {
            return res.json({ reflection: JSON.parse(cachedReflection), cached: true });
        }

        // If not in cache, generate via Gemini (or return error if we prefer only cached hits for cost)
        // For now, let's allow on-demand generation if cache miss
        const reflection = await generateReflection(circleId);

        // Cache it for 24h
        await redis.set(cacheKey, JSON.stringify(reflection), 'EX', 86400);

        res.json({ reflection, cached: false });
    } catch (error) {
        console.error('Reflection Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate reflection' });
    }
});

async function generateReflection(circleId) {
    // In a real implementation, fetch circle context from Prisma
    // and call Gemini API here.
    // For this boilerplate, returning a placeholder.
    return {
        text: "The path to true north is found within the silence of the heart.",
        verse: "Psalm 46:10",
        action: "Take 5 minutes today to practice stillness."
    };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`True North Backend running on port ${PORT}`);
});
