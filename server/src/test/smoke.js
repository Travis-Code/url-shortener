// Server smoke test: boot app on ephemeral port and hit /api/health
const http = require('http');
let app;

// Prefer built output; fall back to ts-node in dev
try {
	// Prefer compiled app module which exports the Express app
	app = require('../../dist/app.js');
} catch (_e) {
	try {
		// Fallback to TypeScript source app module
		require('ts-node/register');
		app = require('../app.ts');
	} catch (e2) {
		console.error('Could not load server app (dist or src):', e2.message);
		process.exit(2);
	}
}

const run = async () => {
	try {
		const expressApp = app.default || app;
		const server = expressApp.listen(0);
		await new Promise((resolve) => server.once('listening', resolve));
		const { port } = server.address();

		const req = http.request({ hostname: '127.0.0.1', port, path: '/api/health', method: 'GET' }, (res) => {
			let body = '';
			res.on('data', (chunk) => (body += chunk));
			res.on('end', () => {
				try {
					if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
					const json = JSON.parse(body);
					if (json.status !== 'ok') throw new Error('Unexpected body');
					console.log('Server smoke test: OK');
					server.close(() => process.exit(0));
				} catch (e) {
					console.error('Server smoke test failed:', e.message);
					server.close(() => process.exit(2));
				}
			});
		});

		req.on('error', (e) => {
			console.error('Server smoke test request error:', e.message);
			server.close(() => process.exit(2));
		});
		req.end();
	} catch (err) {
		console.error('Server smoke test failed:', err.message || err);
		process.exit(2);
	}
};

run();
