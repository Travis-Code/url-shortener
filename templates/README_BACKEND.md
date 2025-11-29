# Backend API

Brief description of the API purpose and main responsibilities.

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)

## Status
- Live API: `https://api.your-domain`
- CI: badge here
- Tech: Node.js, Express, TypeScript, PostgreSQL

## Features
- Auth (JWT), validation, rate limiting
- CRUD endpoints for core resources
- Health checks and diagnostics

## Getting Started
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Environment Variables
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`
- `FRONTEND_URL`
- `BASE_URL`

## API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/health`
- List core resource endpoints…

## Testing
```bash
npm test
```
- Unit tests: services, utils
- Integration: routes with Supertest

## Deployment
- Render/Heroku: set env vars, run `npm run build && npm start`

## Security
- Parameterized queries (SQL injection safe)
- JWT verification middleware
- CORS restricted to frontend origin

## Roadmap
- Add rate limiting, request logging, OpenAPI docs
