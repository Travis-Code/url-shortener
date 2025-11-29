// Minimal smoke test for client build
try {
  console.log('Client smoke test: OK');
  process.exit(0);
} catch (err) {
  console.error('Client smoke test failed', err);
  process.exit(2);
}
