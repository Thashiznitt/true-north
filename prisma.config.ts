import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Load env from root .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectionString = process.env.DATABASE_URL!;

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  migrate: {
    async adapter() {
      const { Pool } = await import("pg");
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL ?? connectionString,
        ssl: { rejectUnauthorized: false },
      });
      return new PrismaPg(pool);
    },
  },
});
