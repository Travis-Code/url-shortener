# URL Shortener - Full Stack Project

![CI](https://github.com/Travis-Code/url-shortener/actions/workflows/ci.yml/badge.svg)

A modern full-stack URL shortening application with real-time analytics, user authentication, and a responsive UI.

## Project Status

**✅ Local Development:** Fully functional and tested
- Backend running on `http://localhost:5001`
- Frontend running on `http://localhost:3000`
- PostgreSQL database with complete schema and seeded data
- All features working: authentication, URL shortening, analytics, admin dashboard

**🚧 Production Deployment:** In progress
- Backend deployed to Railway (investigating database connection issues)
- Frontend deployment pending backend stability
- CI/CD pipeline active and passing (GitHub Actions)

**Ready to use locally!** Follow the [Getting Started](#getting-started) guide below to run the application on your machine.

## How It Works

**URL Shortener** transforms long URLs into short, shareable links while tracking engagement analytics.

### User Flow

1. **Sign Up / Log In**
   - Create an account or log in with existing credentials
   - Authentication uses JWT tokens for secure sessions

2. **Create Short URLs**
   - Paste any long URL into the dashboard
   - Add optional title and description for organization
   - Get an instant short link (e.g., `http://localhost:5001/abc1234`)

3. **Share & Track**
   - Share your short link anywhere (email, social media, documents)
   - Every click is automatically tracked with metadata (IP, referrer, user agent, timestamp)
   - View real-time click counts on your dashboard

4. **View Analytics**
   - See total clicks per URL
   - Access detailed click history with IP addresses, timestamps, and referrer information
   - Monitor which links are performing best

5. **Manage Links**
   - View all your shortened URLs in one place
   - Delete links you no longer need
   - Links cascade-delete their click analytics automatically

### Example Use Cases

- **Marketing Campaigns**: Track which channels drive the most traffic
- **Social Media**: Share clean, professional links instead of long URLs
- **Email Newsletters**: Monitor engagement and click-through rates
- **Personal Portfolio**: Organize and track your shared content

## Features

✨ **Core Features:**
- Create short, shareable URLs
- Custom titles and descriptions
- Real-time click tracking and analytics
- User authentication with JWT
- Responsive design with Tailwind CSS
- User dashboard to manage links
- **Admin dashboard** - Comprehensive system monitoring and management

📊 **Analytics (User Dashboard):**
- Track total clicks per URL
- View recent clicks with IP, referrer, and timestamp
- Real-time expiration status badges
- **Geographic tracking** - Country and city from IP address
- **Top locations chart** - Visual breakdown of clicks by location
- **Browser analytics** - Track which browsers users are using (Chrome, Safari, Firefox, etc.)
- **Operating system analytics** - See which OS visitors use (Windows, macOS, iOS, Android, etc.)
- **Device type analytics** - Monitor mobile, tablet, and desktop usage

👨‍💼 **Admin Dashboard:**
- **Overview Stats** - Total users, URLs, clicks, and activity metrics
- **User Management** - View all users with URL count and click stats, ban/unban users
- **URL Management** - View and delete any URL in the system
- **Advanced Analytics**:
  - Filter by user or time range (7/30/90 days, all time)
  - Summary cards: total clicks, unique URLs, mobile traffic %, unique visitors
  - **Geographic breakdown**: Top 5 countries with visual progress bars
  - **Browser distribution**: Top 5 browsers with percentages
  - **Device breakdown**: Mobile/Desktop/Tablet split
  - **Top 10 URLs**: Ranked by performance with click counts and share %
  - **Recent clicks table**: Full tracking data with browser, OS, device, location, IP
  - Real-time filtering and data visualization

⏰ **Link Expiration:**
- Set optional expiration dates when creating URLs
- Automatic expiration enforcement on redirect
- Visual status indicators (Active, Expiring, Expired)
- Manual cleanup script to purge expired links

🌍 **Geolocation:**
- Automatic IP-to-location lookup using geoip-lite
- Track clicks by country and city
- Top 5 countries visualization in admin dashboard
- Location displayed in recent clicks table

🔒 **Security:**
- **Helmet.js** - HTTP security headers
- **Rate limiting** - Brute force protection (5 attempts per 15 minutes)
- **XSS protection** - Input sanitization on all user inputs
- **Strong JWT secrets** - 256-bit cryptographic random strings (no fallbacks)
- **Input validation** - Email regex and password requirements (min 8 characters)
- **Password hashing** with bcryptjs
- **JWT-based authentication**
- **Protected routes** and API endpoints
- **Admin middleware** - Role-based access control
- **CORS enabled** with environment-based origins
- **Payload size limits** (10MB)
- Complete security documentation in SECURITY.md

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing
- geoip-lite for geolocation
- ua-parser-js for user-agent parsing
- helmet for HTTP security headers
- express-rate-limit for brute force protection
- xss for input sanitization

**Frontend:**
- React 18 with TypeScript
- React Router v6
- Tailwind CSS
- Axios for HTTP requests
- Vite for build tooling
- Context API for auth state management

## Project Structure

```
FullStackProject/
├── server/                 # Backend API
│   ├── src/
│   │   ├── db/            # Database setup and initialization
│   │   │   └── migrations/ # Database migrations (admin role, etc.)
│   │   ├── routes/        # API routes (auth, urls, admin, diagnostics)
│   │   ├── middleware/    # Auth and admin middleware
│   │   ├── scripts/       # Seed and cleanup scripts
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                # Frontend React app
│   ├── src/
│   │   ├── api/          # API client with admin endpoints
│   │   ├── pages/        # Page components (Home, Login, Signup, Dashboard, Analytics, Admin)
│   │   ├── components/   # Reusable components (ProtectedRoute)
│   │   ├── utils/        # Context and utilities (AuthContext)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── SECURITY.md           # Security documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+ (running locally)

### Database Setup

Create the PostgreSQL database:
```bash
createdb url_shortener
```

The database tables will be automatically created when the backend starts.

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
PORT=5001
DATABASE_URL=postgresql://yourusername@localhost:5432/url_shortener
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5001
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`

<!-- GitHub Actions status badge -->
![CI](https://github.com/Travis-Code/url-shortener/actions/workflows/ci.yml/badge.svg)

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing

- Smoke runner: Fast end-to-end sanity check for both server and client.

```zsh
npm run smoke:all
```

This executes `server/test/smoke.js` (verifies `/api/health`) and `client/test/smoke.js` (verifies core scaffolding). It fails fast if the app cannot start or respond.

## CI Behavior

- Workflow: `CI` runs on pushes and PRs to `main`.
- Steps: Checkout → Node setup → install/build server and client → optional tests → smoke runner (`npm run smoke:all`).
- Gate: The job name is `build`; branch protection should require this check to pass.
- Artifacts: No deploy in CI; build steps validate TypeScript and bundle correctness.

## Troubleshooting

- Backend not responding:
   - Ensure `server/.env` has a strong `JWT_SECRET` and correct `DATABASE_URL`.
   - Check port: `lsof -nP -iTCP:5001 -sTCP:LISTEN` (macOS). Kill stray: `lsof -ti:5001 | xargs kill -9`.
   - Run health: `curl -s http://localhost:5001/api/health`.
- Database connection issues:
   - Create DB: `createdb url_shortener`.
   - Verify URL: `psql "$DATABASE_URL" -c "\conninfo"`.
- Frontend build/dev errors:
   - Clear cache: delete `client/node_modules` and reinstall: `cd client && npm ci`.
   - Port conflicts: `lsof -ti:3000 | xargs kill -9` then `npm run dev`.
- TypeScript/Jest complaints in server tests:
   - Confirm `server/tsconfig.json` includes `types: ["node", "jest"]` and `include: ["src", "test"]`.
- Smoke runner fails in CI:
   - Check preceding build logs; server smoke expects `dist` or falls back to ts-node.
   - Re-run locally: `npm run smoke:all` and inspect console output.

## Common Commands

```zsh
# Backend
cd server && npm run dev              # start API in dev
cd server && npm run build            # compile TypeScript
cd server && npm start                # run compiled server
cd server && npm run seed             # seed demo data
cd server && npm run cleanup          # purge expired URLs
curl -s http://localhost:5001/api/health  # health check

# Frontend
cd client && npm run dev              # start Vite dev server
cd client && npm run build            # build frontend
cd client && npm run preview          # preview built app

# Ports (macOS)
lsof -ti:5001 | xargs kill -9 2>/dev/null || echo "Port 5001 free"
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 free"

# Workspace
npm run smoke:all                     # run smoke tests (server+client)
```

### Environment Tips

- Required server env: `JWT_SECRET`, `DATABASE_URL`, `PORT`, `BASE_URL`, `FRONTEND_URL`.
- Generate a strong secret:
   ```zsh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
- Local database URL example:
   ```
   DATABASE_URL=postgresql://$USER@localhost:5432/url_shortener
   ```
- Health quick-checks:
   - Backend: `curl -s http://localhost:5001/api/health`
   - Frontend dev: visit `http://localhost:3000`

## Local Development

**Currently running locally:**
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`
- Database: PostgreSQL (local `url_shortener` database)

To start the application:
1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Visit `http://localhost:3000` in your browser

## Seed & Test Data

You can populate demo data and run the integration tests to showcase functionality:

**Seed Demo Content**
```bash
cd server
npm run seed
```
This creates a demo user (email pattern `demo+TIMESTAMP@example.com`, password `password123`) and inserts 5 technology URLs with synthetic click analytics.

**Cleanup Expired URLs**
```bash
cd server
npm run cleanup
```
Manually removes all expired URLs from the database. In production, schedule this with cron (e.g., daily at 2am).

**Run Backend Tests**
```bash
cd server
npm test
```
Tests cover signup, login, URL creation, redirect, and analytics. They use the exported Express `app` directly for fast execution.

**One-Liner (from repo root)**
```bash
(cd server && npm run seed && npm test)
```

**Check Last Seeded User**
```bash
psql "$DATABASE_URL" -c "SELECT email, created_at FROM users ORDER BY id DESC LIMIT 1;"
```

**Smoke Test (legacy)**
```bash
cd server
npm run smoke
```

## Deployment

### Production Status

🚧 **Backend**: Deployed to Railway (troubleshooting database connection issues)
- URL: `https://url-shortener-production-c83f.up.railway.app`
- Status: Currently returning 502 errors, investigating database SSL configuration
- Database: Railway PostgreSQL with SSL enabled

⏳ **Frontend**: Not yet deployed (pending backend stability)
- Target: Vercel or Netlify
- Will connect to Railway backend once stable

🟢 **Local Development**: Fully functional
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`
- Database: Local PostgreSQL

### Deployment Configuration

**Backend (Railway):**
- Repository: Connected to GitHub `Travis-Code/url-shortener`
- Service: Node.js with PostgreSQL plugin
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL` - Provided by Railway PostgreSQL plugin with `?sslmode=require`
  - `JWT_SECRET` - 256-bit cryptographic random string
  - `NODE_ENV=production`
  - `FRONTEND_URL` - Set to frontend URL once deployed
  - `BASE_URL` - Railway-provided URL

**Frontend (Pending):**
- Platform: Vercel or Netlify (TBD)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL` - Railway backend URL

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration:

- **Workflow File**: `.github/workflows/ci.yml`
- **Trigger**: Push or PR to `main` branch
- **Steps**:
  1. Checkout code
  2. Set up Node.js 18
  3. Install dependencies (server + client)
  4. Build both applications
  5. Run integration tests (local only)
  6. Execute smoke tests

**Current Status**: ✅ Passing (remote integration tests temporarily disabled)

**Note**: Remote integration tests against Railway backend are currently skipped in CI due to 502 errors. They will be re-enabled once the production backend is stable.

### Troubleshooting Production Deployment

**Known Issues:**

1. **Railway Backend 502 Errors**
   - Symptom: All API endpoints returning 502 Bad Gateway
   - Suspected Cause: Database connection SSL configuration or Railway internal networking
   - Investigation Steps:
     - Check Railway dashboard logs for specific errors
     - Verify DATABASE_URL includes `?sslmode=require`
     - Confirm all environment variables are set
     - Test database connection from Railway shell

2. **Database SSL Configuration**
   - Code includes conditional SSL logic (production only)
   - Railway requires `sslmode=require` in connection string
   - Local development works without SSL

**Deployment Checklist:**

Backend (Railway):
- [x] Repository connected to GitHub
- [x] PostgreSQL plugin added
- [x] Environment variables configured
- [x] Build and start commands set
- [x] Initial deployment completed
- [ ] Health endpoint responding successfully
- [ ] Database connection working
- [ ] API endpoints returning expected responses

Frontend (Vercel/Netlify):
- [ ] Repository imported
- [ ] Build settings configured
- [ ] Environment variables set (`VITE_API_URL`)
- [ ] Domain configured
- [ ] Deployment successful
- [ ] Application loads and connects to backend

Testing & Validation:
- [x] Local integration tests passing
- [x] CI pipeline passing (with remote tests skipped)
- [ ] Production health check successful
- [ ] Remote integration tests re-enabled and passing
- [ ] Full user flow tested in production
- [ ] Analytics tracking verified in production

### Next Steps

1. **Fix Railway Backend**
   - Access Railway dashboard to view deployment logs
   - Identify specific database connection error
   - Test connection using Railway shell or SQL console
   - Verify SSL configuration is applied correctly
   - Redeploy if necessary

2. **Re-enable Remote Tests**
   - Once backend is healthy, update `.github/workflows/ci.yml`
   - Remove `--testPathIgnorePatterns=integration.remote.test.ts`
   - Verify all remote integration tests pass

3. **Deploy Frontend**
   - Choose platform (Vercel recommended)
   - Configure build settings
   - Set `VITE_API_URL` to Railway backend URL
   - Test full user flow in production

4. **Final Validation**
   - Complete end-to-end testing
   - Verify analytics tracking
   - Test all user flows
   - Update README with live demo links

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Log in to existing account

### URLs

- `POST /api/urls/create` - Create a short URL (requires auth)
- `GET /api/urls` - Get user's short URLs (requires auth)
- `GET /api/urls/:id/analytics` - Get analytics for a URL (requires auth)
- `DELETE /api/urls/:id` - Delete a URL (requires auth)
- `GET /:shortCode` - Redirect to original URL

### Admin (requires admin role)

- `GET /api/admin/stats` - System-wide statistics
- `GET /api/admin/users` - List all users with metrics
- `GET /api/admin/urls` - List all URLs in system
- `GET /api/admin/clicks` - All click analytics with filters
- `DELETE /api/admin/urls/:id` - Delete any URL
- `POST /api/admin/users/:id/ban` - Ban/unban a user

### Health Check

- `GET /api/health` - API health status
- `GET /api/diagnostics` - System diagnostics

## Request/Response Examples

### Create Short URL

**Request:**
```bash
curl -X POST http://localhost:5001/api/urls/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "title": "My Link",
    "description": "Description of the link"
  }'
```

**Response:**
```json
{
  "id": 1,
  "shortCode": "abc1234",
  "shortUrl": "http://localhost:5001/abc1234",
  "originalUrl": "https://example.com/very/long/url",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Development

### Running Tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Building for Production

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

## Deployment

### Backend Deployment (Railway, Heroku, etc.)

1. Set up environment variables on your hosting platform
2. Push to git repository
3. Connect repository to deployment service
4. Deploy with `npm run build && npm start`

### Frontend Deployment (Vercel, Netlify, etc.)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## Admin Access

The system includes a role-based admin dashboard. To create an admin user:

1. Run the admin migration:
```bash
cd server
npx ts-node src/db/migrations/add_admin_role.ts
```

2. Create an admin account:
```sql
psql url_shortener
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

Or use the seeded demo admin:
- Email: `admin@example.com`
- Password: `password123`

Admin dashboard available at: `http://localhost:3000/admin`

## Next Steps to Enhance

1. **Email Verification** - Verify email on signup
2. **Password Reset** - Allow users to reset forgotten passwords
3. **Custom Short Codes** - Let users choose their own short codes
4. ✅ **Link Expiration** - Auto-delete links after expiration date (DONE)
5. ✅ **Advanced Analytics** - Charts, location tracking, device analytics (DONE)
6. ✅ **Rate Limiting** - Prevent abuse of URL creation (DONE)
7. **Link Sharing** - Generate QR codes, social media share buttons
8. ✅ **Admin Dashboard** - Monitor all users and links (DONE)
9. **API Documentation** - Swagger/OpenAPI docs
10. **Testing** - Unit tests, integration tests, E2E tests
11. **Real-time Dashboard** - WebSocket live updates
12. **Export Reports** - CSV/PDF analytics exports
13. **Custom Domains** - Allow users to use their own domains

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Author

Your Name

---

**Ready to deploy?** Check out deployment guides for [Vercel](https://vercel.com), [Railway](https://railway.app), [Netlify](https://netlify.com), and [Heroku](https://heroku.com).
