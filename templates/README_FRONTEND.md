# Frontend App

Brief description of the UI, audience, and core value.

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)

## Status
- Live App: `https://your-frontend-url`
- CI: badge here
- Tech: React, TypeScript, Vite, Tailwind CSS

## Features
- Auth flows, routing, protected pages
- Responsive UI, accessibility basics
- API integration with Axios

## Getting Started
```bash
cd client
npm install
npm run dev
```

- Dev server: `http://localhost:3000`

## Configuration
- API base is proxied via `vite.config.ts`
- Add environment variables if applicable (e.g., `VITE_API_URL`)

## Structure
- `src/pages` – route-level components
- `src/components` – shared UI components
- `src/api` – Axios client and endpoints
- `src/utils` – helpers and contexts

## Testing
```bash
npm test
```
- React Testing Library + Vitest/Jest

## Deployment
- Vercel/Netlify: run `npm run build`, deploy `dist`

## Roadmap
- Add loading states, error boundaries, analytics events
