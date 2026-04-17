import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log('Connected to DB for Feedback table creation');

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "beta_feedback" (
          "id" TEXT NOT NULL,
          "email" TEXT,
          "theme" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "beta_feedback_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log('beta_feedback table natively mounted successfully!');
  } catch (error) {
    console.error('Error creating feedback table:', error);
  } finally {
    await client.end();
  }
}

run();
