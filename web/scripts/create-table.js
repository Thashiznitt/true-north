import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log('Connected to DB for migration fix');

  try {
    // Drop the incorrectly cased table
    await client.query(`DROP TABLE IF EXISTS "BetaTester" CASCADE;`);
    
    // Create the properly mapped table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "beta_testers" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "platform" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_email_key" ON "beta_testers"("email");
    `);

    console.log('beta_testers table correctly mapped and rebuilt successfully!');
  } catch (error) {
    console.error('Error rebuilding table:', error);
  } finally {
    await client.end();
  }
}

run();
