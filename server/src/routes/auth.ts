import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import xss from 'xss';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

const router = Router();

// Rate limiting for auth endpoints (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// More restrictive rate limiting for signup (3 signups per hour per IP)
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 signups per hour
  message: 'Too many accounts created from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to get client IP
const getClientIp = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

// SIGNUP
router.post('/signup', signupLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if IP is banned
    const clientIp = getClientIp(req);
    const bannedCheck = await pool.query('SELECT id FROM banned_ips WHERE ip_address = $1', [clientIp]);
    
    if (bannedCheck.rows.length > 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize inputs
    username = xss(username.trim());
    email = xss(email.trim().toLowerCase());

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    logger.error('signup_error', { message: err.message });
    err.status = 500;
    err.publicMessage = 'Server error';
    next(err);
  }
});

// LOGIN
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Sanitize email
    email = xss(email.trim().toLowerCase());

    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const result = await pool.query('SELECT id, username, email, password_hash FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err: any) {
    logger.error('login_error', { message: err.message });
    err.status = 500;
    err.publicMessage = 'Server error';
    next(err);
  }
});

export default router;
