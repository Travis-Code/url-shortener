import { Pool } from 'pg';
import dotenv from 'dotenv';

// Only load from .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;

console.log('[DB Pool] Environment:', process.env.NODE_ENV || 'development');
console.log('[DB Pool] DATABASE_URL present:', !!connectionString);
if (!connectionString) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('In production, Railway should inject this automatically.');
  console.error('In development, ensure .env file exists with DATABASE_URL set.');
}

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 5000 to handle startup delays
  statement_timeout: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
