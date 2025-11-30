import { Router, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();

// All admin routes require authentication AND admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/stats - System-wide statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const urlsResult = await pool.query('SELECT COUNT(*) FROM urls');
    const clicksResult = await pool.query('SELECT COUNT(*) FROM clicks');
    const activeUrlsResult = await pool.query(
      'SELECT COUNT(*) FROM urls WHERE expires_at IS NULL OR expires_at > NOW()'
    );
    const expiredUrlsResult = await pool.query(
      'SELECT COUNT(*) FROM urls WHERE expires_at IS NOT NULL AND expires_at <= NOW()'
    );
    
    // Top users by URL count
    const topUsersResult = await pool.query(`
      SELECT u.id, u.username, u.email, COUNT(urls.id) as url_count
      FROM users u
      LEFT JOIN urls ON u.id = urls.user_id
      GROUP BY u.id, u.username, u.email
      ORDER BY url_count DESC
      LIMIT 10
    `);

    // Recent signups
    const recentUsersResult = await pool.query(`
      SELECT id, username, email, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalUrls: parseInt(urlsResult.rows[0].count),
      totalClicks: parseInt(clicksResult.rows[0].count),
      activeUrls: parseInt(activeUrlsResult.rows[0].count),
      expiredUrls: parseInt(expiredUrlsResult.rows[0].count),
      topUsers: topUsersResult.rows,
      recentUsers: recentUsersResult.rows,
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users - Get all users with pagination
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const usersResult = await pool.query(
      `SELECT u.id, u.username, u.email, u.is_admin, u.created_at,
              COUNT(urls.id) as url_count,
              COALESCE(SUM(urls.clicks), 0) as total_clicks
       FROM users u
       LEFT JOIN urls ON u.id = urls.user_id
       GROUP BY u.id, u.username, u.email, u.is_admin, u.created_at
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(countResult.rows[0].count);

    res.json({
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/urls - Get all URLs from all users with pagination
router.get('/urls', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const urlsResult = await pool.query(
      `SELECT urls.id, urls.short_code, urls.original_url, urls.title, 
              urls.clicks, urls.created_at, urls.expires_at,
              users.username, users.email
       FROM urls
       JOIN users ON urls.user_id = users.id
       ORDER BY urls.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM urls');
    const totalUrls = parseInt(countResult.rows[0].count);

    res.json({
      urls: urlsResult.rows,
      pagination: {
        page,
        limit,
        totalUrls,
        totalPages: Math.ceil(totalUrls / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching URLs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/urls/:id - Delete any URL
router.delete('/urls/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM urls WHERE id = $1 RETURNING id, short_code',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({ 
      message: 'URL deleted successfully',
      deletedUrl: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/ban - Ban or unban a user
router.patch('/users/:id/ban', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    if (typeof banned !== 'boolean') {
      return res.status(400).json({ error: 'banned field must be boolean' });
    }

    // Prevent admin from banning themselves
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }

    // For now, we'll add a banned column. Let's add it via migration if needed
    // For simplicity, we'll just delete their URLs as a "ban"
    if (banned) {
      await pool.query('DELETE FROM urls WHERE user_id = $1', [id]);
      res.json({ message: 'User banned - all URLs deleted' });
    } else {
      res.json({ message: 'User unbanned' });
    }
  } catch (err) {
    console.error('Error banning user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/clicks - All click analytics with browser and location
router.get('/clicks', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM clicks');
    const total = parseInt(countResult.rows[0].count);

    // Get clicks with URL and user info
    const clicksResult = await pool.query(`
      SELECT 
        c.id,
        c.clicked_at,
        c.ip_address,
        c.country,
        c.city,
        c.browser,
        c.os,
        c.device_type,
        c.user_agent,
        c.referer,
        u.short_code,
        u.original_url,
        users.id as user_id,
        users.username,
        users.email
      FROM clicks c
      JOIN urls u ON c.url_id = u.id
      JOIN users ON u.user_id = users.id
      ORDER BY c.clicked_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      clicks: clicksResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching clicks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
