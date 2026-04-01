import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load env vars from root .env file
config({ path: resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
