import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

import bcrypt from 'bcryptjs';

// Temporary endpoint to promote user to admin and reset password
router.post('/promote-admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const newPassword = 'Admin!2024$SecureP@ssw0rd#XyZ9';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // First, ensure the column exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL
    `);
    
    // Update the user with admin status and new password
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE, password_hash = $1 WHERE email = $2 RETURNING id, email, username, is_admin',
      [hashedPassword, email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User promoted to admin and password updated', 
      user: result.rows[0],
      password: newPassword
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

export default router;
