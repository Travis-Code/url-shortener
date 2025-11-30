import pool from '../pool';

async function addAdminRole() {
  try {
    console.log('→ Adding is_admin column to users table...');
    
    // Add is_admin column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL
    `);
    
    console.log('✓ is_admin column added successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

addAdminRole();
