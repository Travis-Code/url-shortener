import pool from '../pool';

export const increaseShortCodeLength = async () => {
  try {
    console.log('Running migration: increase short_code length to 20 characters...');
    await pool.query(`
      ALTER TABLE urls 
      ALTER COLUMN short_code TYPE VARCHAR(20)
    `);
    console.log('✓ Migration complete: short_code now accepts up to 20 characters');
  } catch (err: any) {
    console.error('Migration failed:', err.message);
    throw err;
  }
};
