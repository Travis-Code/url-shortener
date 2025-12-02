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

// Railway or any remote DB with SSL (detect by sslmode in connection string OR production env)
const requiresSSL = connectionString?.includes('sslmode=require') || 
                    connectionString?.includes('railway.internal') ||
                    process.env.NODE_ENV === 'production';

console.log('[DB] SSL required:', requiresSSL);

// Configure pool with SSL settings for Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: requiresSSL ? {
    rejectUnauthorized: false
  } : false
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('[DB] Client connected successfully');
});

export default pool;
