import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init';
import pool from './db/pool';
import authRoutes from './routes/auth';
import urlRoutes from './routes/urls';
import diagnosticsRoutes from './routes/diagnostics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get('/api/health', (req, res) => {
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

    // Check if URL is expired
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).send('URL has expired');
    }

    // Track click
    const getClientIp = (req: any) => {
      return req.headers['x-forwarded-for']?.split(',')[0] || 
             req.socket.remoteAddress || 
             'unknown';
    };
    
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
    res.status(500).send('Server error');
  }
});

// Initialize database with retries
const initializeDatabaseWithRetry = async (maxRetries = 30, delayMs = 2000) => {
  console.log('Starting database initialization with retries...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***set***' : 'NOT SET');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries} to initialize database...`);
      await initializeDatabase();
      console.log('✓ Database initialized successfully');
      return;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`✗ Attempt ${i + 1}/${maxRetries} failed: ${errorMsg}`);
      if (i < maxRetries - 1) {
        console.log(`  Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  console.error('⚠ Failed to initialize database after all retries. API will operate without database.');
};

// Start server
const startServer = async () => {
  // Start the HTTP server first (don't block on database)
  const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
  
  // Initialize database in background (non-blocking)
  initializeDatabaseWithRetry().catch(err => {
    console.error('⚠ Database initialization failed, but server is still running');
    console.error('Error:', err.message);
  });
};

startServer().catch(err => {
  console.error('Fatal: Could not start server:', err);
  process.exit(1);
});
