// Client smoke test: ensure App component exists and Vite config is present (ESM-compatible)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const appPathTsx = path.join(__dirname, '..', 'src', 'App.tsx');
  const appPathJsx = path.join(__dirname, '..', 'src', 'App.jsx');
  const appPath = fs.existsSync(appPathTsx) ? appPathTsx : appPathJsx;
  if (!fs.existsSync(appPath)) throw new Error('App component not found');

  const viteConfigTs = path.join(__dirname, '..', 'vite.config.ts');
  const viteConfigJs = path.join(__dirname, '..', 'vite.config.js');
  const viteConfig = fs.existsSync(viteConfigTs) ? viteConfigTs : viteConfigJs;
  if (!fs.existsSync(viteConfig)) throw new Error('vite config missing');

  console.log('Client smoke test: OK');
  // Optional reachability checks (non-fatal) for this project only
  // Frontend: http://localhost:3000
  // Backend:  http://localhost:5001/api/health
  try {
    const http = await import('http');
    // Check frontend on 3000
    await new Promise((resolve) => {
      const req = http.request({ host: 'localhost', port: 3000, method: 'HEAD', path: '/' }, (res) => {
        if (res.statusCode && res.statusCode < 500) resolve(true); else resolve(false);
      });
      req.on('error', () => resolve(false));
      req.end();
    });
    // Check backend health on 5001
    await new Promise((resolve) => {
      const req = http.request({ host: 'localhost', port: 5001, method: 'GET', path: '/api/health' }, (res) => {
        if (res.statusCode && res.statusCode < 500) resolve(true); else resolve(false);
      });
      req.on('error', () => resolve(false));
      req.end();
    });
    console.log('Isolation check: localhost:3000 and :5001 probed (non-fatal)');
  } catch {
    // Never fail the smoke test based on reachability
  }
  process.exit(0);
} catch (err) {
  console.error('Client smoke test failed:', err.message || err);
  process.exit(2);
}
