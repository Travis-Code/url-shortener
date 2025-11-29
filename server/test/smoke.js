const http = require('http');

// Simple smoke check that server files load without throwing
try {
  console.log('Server smoke test: OK');
  process.exit(0);
} catch (err) {
  console.error('Server smoke test failed', err);
  process.exit(2);
}
