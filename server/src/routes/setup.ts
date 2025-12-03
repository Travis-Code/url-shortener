import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

// Temporary endpoint to promote user to admin
router.post('/promote-admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // First, ensure the column exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL
    `);
    
    // Update the user
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING id, email, username, is_admin',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User promoted to admin', 
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

export default router;
