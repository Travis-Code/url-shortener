import { initializeDatabase } from './db/init';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// Validate critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

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

export default app;
