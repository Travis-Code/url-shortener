import { Pool } from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;

console.log('[DB] Environment:', process.env.NODE_ENV || 'development');
console.log('[DB] DATABASE_URL present:', !!connectionString);

if (!connectionString) {
  console.error('[DB] No DATABASE_URL found');
}


// Use SSL only in production (Railway), disable for local
const isProd = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProd ? { ssl: { rejectUnauthorized: false } } : {})
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('[DB] Client connected successfully');
});

export default pool;
