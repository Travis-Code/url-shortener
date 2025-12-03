import pool from './pool';
import { increaseShortCodeLength } from './migrations/increase_shortcode_length';
import addBannedIpsTable from './migrations/add_banned_ips';

export const initializeDatabase = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      short_code VARCHAR(20) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      title VARCHAR(255),
      description TEXT,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS clicks (
      id SERIAL PRIMARY KEY,
      url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
      user_agent TEXT,
      ip_address VARCHAR(45),
      referer TEXT,
      country VARCHAR(2),
      city VARCHAR(100),
      browser VARCHAR(50),
      os VARCHAR(50),
      device_type VARCHAR(20),
      clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code)`,
    `CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id)`
  ];

  try {
    for (const query of queries) {
      await pool.query(query);
    }
    
    // Run migration to increase short_code length if needed
    await increaseShortCodeLength();
    
      // Run migration to add banned_ips table
      await addBannedIpsTable();
    
    console.log('✓ Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};
