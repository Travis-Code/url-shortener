# URL Shortener - Full Stack Project

![CI](https://github.com/Travis-Code/url-shortener/actions/workflows/ci.yml/badge.svg)

A modern full-stack URL shortening application with real-time analytics, user authentication, and a responsive UI.

**Status:** ✅ Fully working locally with PostgreSQL database

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

📊 **Analytics:**
- Track total clicks per URL
- View recent clicks with IP, referrer, and timestamp
- Real-time expiration status badges
- **Geographic tracking** - Country and city from IP address
- **Top locations chart** - Visual breakdown of clicks by location
- **Browser analytics** - Track which browsers users are using (Chrome, Safari, Firefox, etc.)
- **Operating system analytics** - See which OS visitors use (Windows, macOS, iOS, Android, etc.)
- **Device type analytics** - Monitor mobile, tablet, and desktop usage

⏰ **Link Expiration:**
- Set optional expiration dates when creating URLs
- Automatic expiration enforcement on redirect
- Visual status indicators (Active, Expiring, Expired)
- Manual cleanup script to purge expired links

🌍 **Geolocation:**
- Automatic IP-to-location lookup using geoip-lite
- Track clicks by country and city
- Top 10 locations with visual progress bars
- Location displayed in recent clicks table

🔒 **Security:**
- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes and API endpoints
- CORS enabled

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing
- geoip-lite for geolocation
- ua-parser-js for user-agent parsing

**Frontend:**
- React 18 with TypeScript
- React Router v6
- Tailwind CSS
- Axios for HTTP requests
- Vite for build tooling

## Project Structure

```
FullStackProject/
├── server/                 # Backend API
│   ├── src/
│   │   ├── db/            # Database setup and initialization
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Authentication middleware
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                # Frontend React app
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── utils/        # Context and utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
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

## Deployment Notes

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that builds and tests both the backend and frontend.

For deployment to production platforms like Vercel, Railway, Render, or Heroku, you'll need to:
1. Configure environment variables on your hosting platform
2. Set up PostgreSQL database
3. Update `BASE_URL` and `FRONTEND_URL` to production URLs

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

### Health Check

- `GET /api/health` - API health status

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

## Next Steps to Enhance

1. **Email Verification** - Verify email on signup
2. **Password Reset** - Allow users to reset forgotten passwords
3. **Custom Short Codes** - Let users choose their own short codes
4. **Link Expiration** - Auto-delete links after expiration date
5. **Advanced Analytics** - Charts, location tracking, device analytics
6. **Rate Limiting** - Prevent abuse of URL creation
7. **Link Sharing** - Generate QR codes, social media share buttons
8. **Admin Dashboard** - Monitor all users and links
9. **API Documentation** - Swagger/OpenAPI docs
10. **Testing** - Unit tests, integration tests, E2E tests

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
