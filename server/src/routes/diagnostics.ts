import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

router.get('/db', async (req, res) => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as ok');
      res.json({
        status: 'ok',
        latencyMs: Date.now() - start,
        result: result.rows[0],
        databaseUrlPresent: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV || 'development'
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      status: 'error',
      latencyMs: Date.now() - start,
      error: message,
      code: (err as any)?.code,
      databaseUrlPresent: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV || 'development'
    });
  }
});

export default router;
