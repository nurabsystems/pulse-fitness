// src/db/index.js
// The single shared connection to Postgres.
// Every service imports `db` from this file — one pool, one connection.

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

// Create a Postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Neon serverless, disable prepared statements if you hit issues
  // ssl: { rejectUnauthorized: false },
});

// Wrap the pool with Drizzle + our schema
export const db = drizzle(pool, { schema });

// Small helper to verify the connection works
export async function testConnection() {
  const result = await pool.query('SELECT NOW()');
  return result.rows[0].now;
}