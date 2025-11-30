import { Router, Response } from 'express';
import xss from 'xss';
import pool from '../db/pool';
import { generateShortCode, isValidUrl, getClientIp } from '../utils/helpers';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// CREATE short URL (authenticated)
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let { originalUrl, title, description, expiresAt } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Sanitize user inputs
    if (title) title = xss(title.trim());
    if (description) description = xss(description.trim());

    const shortCode = generateShortCode();
    const result = await pool.query(
      'INSERT INTO urls (user_id, short_code, original_url, title, description, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, short_code, created_at',
      [req.userId, shortCode, originalUrl, title, description, expiresAt || null]
    );

    res.status(201).json({
      id: result.rows[0].id,
      shortCode: result.rows[0].short_code,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${result.rows[0].short_code}`,
      originalUrl,
      createdAt: result.rows[0].created_at,
    });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET user's URLs (authenticated)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, short_code, original_url, title, description, clicks, created_at, expires_at FROM urls WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching URLs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET URL analytics (authenticated)
router.get('/:id/analytics', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const urlResult = await pool.query(
      'SELECT id, short_code, clicks FROM urls WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Get recent clicks including parsed UA fields
    const clicksResult = await pool.query(
      'SELECT clicked_at, user_agent, ip_address, referer, country, city, browser, os, device_type FROM clicks WHERE url_id = $1 ORDER BY clicked_at DESC LIMIT 100',
      [id]
    );

    // Get geographic breakdown
    const geoResult = await pool.query(
      `SELECT country, city, COUNT(*) as count
       FROM clicks
       WHERE url_id = $1 AND country IS NOT NULL
       GROUP BY country, city
       ORDER BY count DESC
       LIMIT 10`,
      [id]
    );

    // Browser breakdown
    const browserResult = await pool.query(
      `SELECT COALESCE(browser, 'Unknown') as browser, COUNT(*) as count
       FROM clicks
       WHERE url_id = $1
       GROUP BY browser
       ORDER BY count DESC
       LIMIT 10`,
      [id]
    );

    // OS breakdown
    const osResult = await pool.query(
      `SELECT COALESCE(os, 'Unknown') as os, COUNT(*) as count
       FROM clicks
       WHERE url_id = $1
       GROUP BY os
       ORDER BY count DESC
       LIMIT 10`,
      [id]
    );

    // Device type breakdown
    const deviceResult = await pool.query(
      `SELECT COALESCE(device_type, 'Unknown') as device_type, COUNT(*) as count
       FROM clicks
       WHERE url_id = $1
       GROUP BY device_type
       ORDER BY count DESC`,
      [id]
    );

    res.json({
      shortCode: urlResult.rows[0].short_code,
      totalClicks: urlResult.rows[0].clicks,
      recentClicks: clicksResult.rows,
      topLocations: geoResult.rows,
      topBrowsers: browserResult.rows,
      topOS: osResult.rows,
      topDevices: deviceResult.rows,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE URL (authenticated)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
