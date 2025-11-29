import bcrypt from 'bcryptjs';
import pool from '../db/pool';
import { initializeDatabase } from '../db/init';
import { generateShortCode, isValidUrl } from '../utils/helpers';
import { UAParser } from 'ua-parser-js';

interface CreatedUrlSummary {
  id: number;
  shortCode: string;
  originalUrl: string;
  clicksInserted: number;
}

const DEMO_PASSWORD = 'password123';

async function seed() {
  console.log('→ Seeding database...');
  await initializeDatabase();

  // Clear existing demo data (optional; scoped by email pattern)
  await pool.query("DELETE FROM users WHERE email LIKE 'demo+%@example.com'");

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoEmail = `demo+${Date.now()}@example.com`;
  const username = `demo_${Math.floor(Math.random() * 100000)}`;

  const userRes = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
    [username, demoEmail, hashed]
  );
  const userId = userRes.rows[0].id;
  console.log(`✓ Created demo user: ${demoEmail}`);

  const sampleUrls = [
    'https://developer.mozilla.org/en-US/',
    'https://nodejs.org/en/',
    'https://www.typescriptlang.org/',
    'https://react.dev/',
    'https://github.com/'
  ];

  const created: CreatedUrlSummary[] = [];

  for (const originalUrl of sampleUrls) {
    if (!isValidUrl(originalUrl)) continue;
    const shortCode = generateShortCode();
    const urlRes = await pool.query(
      'INSERT INTO urls (user_id, short_code, original_url, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING id, short_code, original_url',
      [userId, shortCode, originalUrl, 'Sample Link', 'Seeded demo link']
    );
    const urlId = urlRes.rows[0].id;

    // Insert synthetic clicks with diverse geolocations
    const clicksToInsert = Math.floor(Math.random() * 5) + 3; // 3-7 clicks
    const sampleIPs = [
      { ip: '8.8.8.8', country: 'US', city: 'Mountain View' },      // Google DNS
      { ip: '1.1.1.1', country: 'AU', city: 'Sydney' },             // Cloudflare DNS
      { ip: '208.67.222.222', country: 'US', city: 'San Francisco' }, // OpenDNS
      { ip: '151.101.1.140', country: 'US', city: 'San Francisco' }, // Fastly CDN
      { ip: '13.107.42.14', country: 'US', city: 'Boydton' },       // Microsoft
      { ip: '172.217.14.206', country: 'US', city: 'New York' },    // Google
      { ip: '185.199.108.153', country: 'US', city: 'San Francisco' }, // GitHub Pages
      { ip: '104.16.132.229', country: 'US', city: 'San Francisco' }  // Cloudflare
    ];
    
    const sampleUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    ];

    for (let i = 0; i < clicksToInsert; i++) {
      const sample = sampleIPs[Math.floor(Math.random() * sampleIPs.length)];
      const ua = sampleUserAgents[Math.floor(Math.random() * sampleUserAgents.length)];
      
      // Parse user-agent to extract browser, OS, and device type
      const parser = new UAParser(ua);
      const browserName = parser.getBrowser().name || 'Unknown';
      const osName = parser.getOS().name || 'Unknown';
      const deviceType = parser.getDevice().type || 'desktop';
      
      await pool.query(
        'INSERT INTO clicks (url_id, user_agent, ip_address, referer, country, city, browser, os, device_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          urlId,
          ua,
          sample.ip,
          'https://referrer.example',
          sample.country,
          sample.city,
          browserName,
          osName,
          deviceType
        ]
      );
    }
    // Update aggregate clicks column
    await pool.query('UPDATE urls SET clicks = $1 WHERE id = $2', [clicksToInsert, urlId]);

    created.push({
      id: urlId,
      shortCode: urlRes.rows[0].short_code,
      originalUrl: urlRes.rows[0].original_url,
      clicksInserted: clicksToInsert
    });
  }

  console.log('✓ Seeded URLs:');
  for (const c of created) {
    console.log(`  - ${c.shortCode} -> ${c.originalUrl} (clicks: ${c.clicksInserted})`);
  }

  console.log('\nSummary');
  console.log('User Email: ' + demoEmail);
  console.log('Password  : ' + DEMO_PASSWORD);
  console.log('Total URLs: ' + created.length);
  console.log('Done.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
