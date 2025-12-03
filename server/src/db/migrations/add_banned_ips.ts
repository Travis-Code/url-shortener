import pool from '../pool';

async function addBannedIpsTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create banned_ips table to track IPs of banned users
    await client.query(`
      CREATE TABLE IF NOT EXISTS banned_ips (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL UNIQUE,
        reason TEXT,
        banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        banned_by INTEGER REFERENCES users(id)
      );
    `);

    // Add index for fast IP lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_banned_ips_ip_address ON banned_ips(ip_address);
    `);

    await client.query('COMMIT');
    console.log('✅ Migration: banned_ips table created');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if executed directly
if (require.main === module) {
  addBannedIpsTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

export default addBannedIpsTable;
