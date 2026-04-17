import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "BetaTester" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "platform" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "BetaTester_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "BetaTester_email_key" ON "BetaTester"("email");
    `);

    console.log('BetaTester table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await client.end();
  }
}

run();
