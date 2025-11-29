import { Router, Response } from 'express';
import pool from '../db/pool';
import { generateShortCode, isValidUrl, getClientIp } from '../utils/helpers';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// GET short URL - redirect to original
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const result = await pool.query(
      'SELECT id, original_url, expires_at FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const url = result.rows[0];

    // Check if URL is expired
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({ error: 'URL has expired' });
    }

    // Track click
    await pool.query(
      'INSERT INTO clicks (url_id, user_agent, ip_address, referer) VALUES ($1, $2, $3, $4)',
      [url.id, req.get('user-agent'), getClientIp(req), req.get('referer')]
    );

    // Increment click count
    await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE id = $1', [url.id]);

    // Redirect
    res.redirect(url.original_url);
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE short URL (authenticated)
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { originalUrl, title, description, expiresAt } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

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
      'SELECT id, short_code, original_url, title, description, clicks, created_at FROM urls WHERE user_id = $1 ORDER BY created_at DESC',
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

    // Get click analytics
    const clicksResult = await pool.query(
      'SELECT clicked_at, user_agent, ip_address, referer FROM clicks WHERE url_id = $1 ORDER BY clicked_at DESC LIMIT 100',
      [id]
    );

    res.json({
      shortCode: urlResult.rows[0].short_code,
      totalClicks: urlResult.rows[0].clicks,
      recentClicks: clicksResult.rows,
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
