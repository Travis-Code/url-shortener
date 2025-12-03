import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { randomBytes } from 'crypto';
import pool from './db/pool';
import authRoutes from './routes/auth';
import urlRoutes from './routes/urls';
import diagnosticsRoutes from './routes/diagnostics';
import adminRoutes from './routes/admin';
import setupRoutes from './routes/setup';
import { logger } from './utils/logger';

dotenv.config();

export const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow redirects
}));

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);

// Correlation ID middleware
app.use((req: any, _res: Response, next: NextFunction) => {
  req.correlationId = randomBytes(8).toString('hex');
  next();
});

// Request logging with correlation ID
app.use((req: any, _res: Response, next: NextFunction) => {
  logger.info('request', {
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/diag', diagnosticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/setup', setupRoutes);

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

    const uaString = req.get('user-agent') || '';
    const parser = new UAParser(uaString);
    const browserName = parser.getBrowser().name || 'Unknown';
    const osName = parser.getOS().name || 'Unknown';
    const deviceType = parser.getDevice().type || 'Desktop';

    await pool.query(
      'INSERT INTO clicks (url_id, user_agent, ip_address, referer, country, city, browser, os, device_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        url.id,
        uaString,
        ipAddress,
        req.get('referer'),
        country,
        city,
        browserName,
        osName,
        deviceType,
      ]
    );

    await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE id = $1', [url.id]);

    res.redirect(url.original_url);
  } catch (err) {
    logger.error('redirect_error', { message: err instanceof Error ? err.message : String(err) });
    res.status(500).send('Server error');
  }
});

// Global error handler (last middleware)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const code = err.code || 'internal_error';
  const message = err.publicMessage || 'Server error';
  logger.error('unhandled_error', {
    status,
    code,
    message: err.message || message,
  });
  res.status(status).json({ error: message, code });
});

export default app;
