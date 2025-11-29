import pool from '../pool';

/**
 * Add country and city columns to clicks table for geolocation tracking
 */
export async function addGeolocationColumns() {
  const queries = [
    `ALTER TABLE clicks ADD COLUMN IF NOT EXISTS country VARCHAR(2)`,
    `ALTER TABLE clicks ADD COLUMN IF NOT EXISTS city VARCHAR(100)`,
    `CREATE INDEX IF NOT EXISTS idx_clicks_country ON clicks(country)`,
  ];

  try {
    for (const query of queries) {
      await pool.query(query);
    }
    console.log('✓ Added geolocation columns to clicks table');
  } catch (err) {
    console.error('Error adding geolocation columns:', err);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  addGeolocationColumns()
    .then(() => {
      console.log('Migration complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
