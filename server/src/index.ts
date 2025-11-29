import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init';
import authRoutes from './routes/auth';
import urlRoutes from './routes/urls';

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
  try {
    // Start the server immediately
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
    
    // Initialize database in the background with retries
    initializeDatabaseWithRetry().catch(err => {
      console.error('Database initialization error:', err);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
