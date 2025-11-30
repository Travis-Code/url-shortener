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
  process.exit(0);
} catch (err) {
  console.error('Client smoke test failed:', err.message || err);
  process.exit(2);
}
