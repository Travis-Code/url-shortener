import pool from '../db/pool';

async function updateAdmin() {
  try {
    console.log('🔗 Connecting to database...');
    
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING id, email, is_admin',
      ['hiptrav9@gmail.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✅ Successfully promoted user to admin!');
    console.log('User:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateAdmin();
