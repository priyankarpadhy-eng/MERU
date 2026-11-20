import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check potential locations for .env file (current working directory, server root, monorepo root)
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/lead_manager?schema=public'),
  JWT_SECRET: z.string().min(16).default('lead-manager-default-jwt-secret-key-32chars'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

// Guarantee process.env is populated for Prisma engine and external consumers
process.env.DATABASE_URL = env.DATABASE_URL;
process.env.JWT_SECRET = env.JWT_SECRET;
process.env.PORT = String(env.PORT);
process.env.NODE_ENV = env.NODE_ENV;
process.env.CLIENT_URL = env.CLIENT_URL;
