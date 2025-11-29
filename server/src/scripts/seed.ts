import bcrypt from 'bcryptjs';
import pool from '../db/pool';
import { initializeDatabase } from '../db/init';
import { generateShortCode, isValidUrl } from '../utils/helpers';

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
    
    for (let i = 0; i < clicksToInsert; i++) {
      const sample = sampleIPs[Math.floor(Math.random() * sampleIPs.length)];
      await pool.query(
        'INSERT INTO clicks (url_id, user_agent, ip_address, referer, country, city) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          urlId,
          'SeedBot/1.0 (+https://example.com/bot)',
          sample.ip,
          'https://referrer.example',
          sample.country,
          sample.city
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
