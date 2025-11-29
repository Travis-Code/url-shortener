import pool from '../pool';

async function run() {
  console.log('→ Migration: add user-agent breakdown columns to clicks table');
  await pool.query(`ALTER TABLE clicks ADD COLUMN IF NOT EXISTS browser VARCHAR(50);`);
  await pool.query(`ALTER TABLE clicks ADD COLUMN IF NOT EXISTS os VARCHAR(50);`);
  await pool.query(`ALTER TABLE clicks ADD COLUMN IF NOT EXISTS device_type VARCHAR(30);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_clicks_browser ON clicks(browser);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_clicks_device_type ON clicks(device_type);`);
  console.log('✓ Columns browser, os, device_type added (if not present)');
  process.exit(0);
}

run().catch(err => { console.error('Migration failed:', err); process.exit(1); });
