import { Pool } from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const rawConnection = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

console.log('[DB Pool] Environment:', process.env.NODE_ENV || 'development');
console.log('[DB Pool] Using public URL first, fallback internal.');
console.log('[DB Pool] DATABASE_PUBLIC_URL present:', !!process.env.DATABASE_PUBLIC_URL);
console.log('[DB Pool] DATABASE_URL present:', !!process.env.DATABASE_URL);

let connectionString: string | undefined = rawConnection || undefined;
if (!connectionString) {
  console.error('[DB Pool] No connection string provided.');
}

let useSsl = false;
if (connectionString) {
  const masked = connectionString.replace(/:[^@]*@/, ':***@');
  console.log('[DB Pool] Connection (masked):', masked);
  try {
    const uri = new URL(connectionString);
    if (/proxy\.rlwy\.net$/i.test(uri.hostname)) {
      useSsl = true;
    }
  } catch (e) {
    console.warn('[DB Pool] Could not parse URL for SSL decision:', e);
  }
}

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  statement_timeout: 30000,
});

console.log('[DB Pool] SSL enabled:', !!useSsl);

pool.on('error', (err) => {
  console.error('[DB Pool] Unexpected error on idle client:', err);
});

pool.on('connect', () => {
  console.log('[DB Pool] Client connected');
});

pool.on('remove', () => {
  console.log('[DB Pool] Client removed');
});

export default pool;
