import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geoip from 'geoip-lite';
import pool from './db/pool';
import authRoutes from './routes/auth';
import urlRoutes from './routes/urls';
import diagnosticsRoutes from './routes/diagnostics';

dotenv.config();

export const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/diag', diagnosticsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Redirect route (must be last to not interfere with /api routes)
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const result = await pool.query(
      'SELECT id, original_url, expires_at FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Cannot GET /' + shortCode);
    }

    const url = result.rows[0];

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).send('URL has expired');
    }

    const getClientIp = (req: any) => {
      return (
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ||
        req.socket.remoteAddress ||
        'unknown'
      );
    };

    const ipAddress = getClientIp(req);
    const geo = geoip.lookup(ipAddress);
    const country = geo?.country || null;
    const city = geo?.city || null;

    await pool.query(
      'INSERT INTO clicks (url_id, user_agent, ip_address, referer, country, city) VALUES ($1, $2, $3, $4, $5, $6)',
      [url.id, req.get('user-agent'), ipAddress, req.get('referer'), country, city]
    );

    await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE id = $1', [url.id]);

    res.redirect(url.original_url);
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).send('Server error');
  }
});

export default app;
