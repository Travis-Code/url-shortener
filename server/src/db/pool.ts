import { Pool } from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

// Extra diagnostic dump (one-time) to verify env visibility
(() => {
  const keysToCheck = [
    'DATABASE_PUBLIC_URL',
    'DATABASE_URL',
    'PGHOST',
    'PGPORT',
    'PGUSER',
    'PGPASSWORD',
    'RAILWAY_TCP_PROXY_DOMAIN',
    'RAILWAY_TCP_PROXY_PORT'
  ];
  console.log('[DB Pool] Visible env snapshot start');
  for (const k of keysToCheck) {
    const v = process.env[k];
    console.log(`  ${k}=${v ? (v.length > 120 ? v.slice(0,120)+'…' : v) : 'undefined'}`);
  }
  console.log('[DB Pool] Visible env snapshot end');
})();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Prefer public proxy; fallback to internal; finally construct from discrete PG* vars if needed.
let rawConnection = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!rawConnection && process.env.PGHOST && process.env.PGUSER) {
  rawConnection = `postgresql://${encodeURIComponent(process.env.PGUSER)}:${encodeURIComponent(process.env.PGPASSWORD || '')}`+
    `@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'railway'}`;
  console.log('[DB Pool] Synthesized connection string from PG* vars');
}

console.log('[DB Pool] Environment:', process.env.NODE_ENV || 'development');
console.log('[DB Pool] Using public URL first, fallback internal.');
console.log('[DB Pool] DATABASE_PUBLIC_URL present:', !!process.env.DATABASE_PUBLIC_URL);
console.log('[DB Pool] DATABASE_URL present:', !!process.env.DATABASE_URL);

let connectionString: string | undefined = rawConnection || undefined;
if (!connectionString) {
  console.error('[DB Pool] No connection string provided.');
}

let useSsl = false;
let parsedHost = '';
let parsedPort = 5432;
let parsedDb = '';
let parsedUser = '';
let parsedPassword = '';
if (connectionString) {
  const masked = connectionString.replace(/:[^@]*@/, ':***@');
  console.log('[DB Pool] Raw connection (masked):', masked);
  try {
    const uri = new URL(connectionString);
    parsedHost = uri.hostname;
    parsedPort = parseInt(uri.port || '5432', 10);
    parsedDb = uri.pathname.replace(/^\//, '');
    parsedUser = decodeURIComponent(uri.username);
    parsedPassword = decodeURIComponent(uri.password);
    // Railway TCP proxy handles TLS termination - use plain connection
    if (/proxy\.rlwy\.net$/i.test(parsedHost)) {
      useSsl = false; // Proxy expects plain Postgres protocol
      console.log('[DB Pool] Using Railway proxy - SSL disabled (proxy handles TLS)');
    } else {
      // Internal network might need SSL
      useSsl = false; // Try without SSL first
    }
  } catch (e) {
    console.warn('[DB Pool] Could not parse URL, falling back to connectionString only:', e);
  }
}

const pool = parsedHost
  ? new Pool({
      host: parsedHost,
      port: parsedPort,
      user: parsedUser,
      password: parsedPassword,
      database: parsedDb,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      statement_timeout: 30000,
    })
  : new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      statement_timeout: 30000,
    });

console.log('[DB Pool] Parsed host:', parsedHost || '(none)');
console.log('[DB Pool] Parsed port:', parsedPort);
console.log('[DB Pool] Parsed database:', parsedDb || '(none)');
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
