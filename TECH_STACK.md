# URL Shortener - Technology Stack Documentation

## Project Overview
A full-stack URL shortening application with user authentication, analytics tracking, and a modern responsive UI.

---

## Frontend Technologies

### **React 18**
- **Purpose**: JavaScript library for building user interfaces
- **Why we use it**: Component-based architecture makes UI code reusable and maintainable
- **In our app**: Handles the dashboard, forms, navigation, and all UI elements

### **TypeScript**
- **Purpose**: Adds static type checking to JavaScript
- **Why we use it**: Catches errors during development before code runs
- **Benefits**: Better IDE autocomplete, documentation, and fewer runtime bugs

### **Vite**
- **Purpose**: Modern build tool and development server
- **Why we use it**: Lightning-fast hot module replacement (instant updates while coding)
- **Replaces**: Older tools like Create React App and Webpack

### **React Router v6**
- **Purpose**: Client-side routing and navigation
- **Routes in our app**:
  - `/` - Home/landing page
  - `/login` - User login
  - `/signup` - User registration
  - `/dashboard` - User's URL management dashboard
  - `/analytics/:id` - Click analytics for specific URLs
- **Features**: Protected routes that redirect unauthenticated users to login

### **Tailwind CSS**
- **Purpose**: Utility-first CSS framework
- **Why we use it**: Rapid UI development without writing custom CSS
- **Example**: `className="bg-blue-500 text-white px-4 py-2 rounded"`
- **Benefits**: Consistent design, smaller CSS bundle, no naming conflicts

### **Axios**
- **Purpose**: HTTP client for making API requests
- **Features**: 
  - Request/response interceptors
  - Automatic JSON parsing
  - Better error handling than fetch API
- **In our app**: 
  - Makes all backend API calls (login, create URL, get analytics)
  - Automatically adds JWT token to every request

---

## Backend Technologies

### **Node.js**
- **Purpose**: JavaScript runtime for server-side code
- **Why we use it**: Run JavaScript outside the browser
- **Benefits**: Same language for frontend and backend

### **Express**
- **Purpose**: Minimal web framework for Node.js
- **Features**:
  - HTTP request/response handling
  - Middleware support
  - Routing system
- **Our API routes**:
  - `POST /api/auth/signup` - Create account
  - `POST /api/auth/login` - User login
  - `POST /api/urls/create` - Create short URL
  - `GET /api/urls` - Get user's URLs
  - `GET /api/urls/:id/analytics` - Get click analytics
  - `DELETE /api/urls/:id` - Delete URL
  - `GET /:shortCode` - Redirect to original URL

### **TypeScript** (Backend)
- **Purpose**: Same as frontend - type safety for Node.js code
- **Benefits**: Prevents bugs in server logic, API contracts, database queries

### **PostgreSQL**
- **Purpose**: Relational database management system
- **Why we use it**: 
  - ACID compliant (reliable transactions)
  - Excellent for structured data with relationships
  - Free and open-source
- **Our schema**:
  - `users` table - User accounts
  - `urls` table - Short URLs and metadata
  - `clicks` table - Analytics data for each click

### **pg (node-postgres)**
- **Purpose**: PostgreSQL client library for Node.js
- **Features**:
  - Connection pooling for performance
  - Parameterized queries (prevents SQL injection)
  - Promise-based API
- **Usage**: Executes all SQL queries from Express routes

### **bcryptjs**
- **Purpose**: Password hashing library
- **Security**: 
  - One-way encryption (can't be reversed)
  - Salt rounds make brute-force attacks impractical
  - Never stores plain text passwords
- **Usage**: Hash passwords on signup, verify on login

### **jsonwebtoken (JWT)**
- **Purpose**: Create and verify authentication tokens
- **How it works**:
  1. User logs in with email/password
  2. Server verifies credentials
  3. Server creates JWT containing user ID
  4. Frontend stores token (localStorage)
  5. Frontend sends token with every request
  6. Server verifies token and identifies user
- **Benefits**: Stateless authentication (no server sessions needed)

### **dotenv**
- **Purpose**: Load environment variables from `.env` file
- **Why we use it**: Keep secrets out of code
- **Variables we use**:
  - `DATABASE_URL` - PostgreSQL connection string
  - `JWT_SECRET` - Secret key for signing tokens
  - `PORT` - Server port number
  - `NODE_ENV` - development or production

### **cors**
- **Purpose**: Enable Cross-Origin Resource Sharing
- **Why we need it**: Frontend (localhost:3000) and backend (localhost:5001) are different origins
- **Security**: Configured to only allow requests from our frontend URL

---

## Development Tools

### **ts-node-dev**
- **Purpose**: TypeScript execution with auto-reload for development
- **Features**:
  - Watches files for changes
  - Auto-restarts server on save
  - No need to manually compile TypeScript
- **Usage**: `npm run dev` starts the development server

### **Git**
- **Purpose**: Distributed version control system
- **Features**:
  - Track all code changes
  - Branch for features
  - Collaborate with team members
  - Rollback to previous versions

### **GitHub**
- **Purpose**: Cloud hosting for Git repositories
- **Features**:
  - Code backup and collaboration
  - Pull requests for code review
  - Issue tracking
  - CI/CD integration

### **GitHub Actions**
- **Purpose**: Continuous Integration and Deployment
- **Our workflow** (`.github/workflows/ci.yml`):
  - Triggers on every push and pull request
  - Builds backend TypeScript
  - Builds frontend React app
  - Runs tests (smoke tests)
  - Ensures code quality before merging

---

## Architecture & Data Flow

### Application Architecture
```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│   React Frontend        │
│   (localhost:3000)      │
│   - React Router        │
│   - Tailwind UI         │
│   - Axios HTTP Client   │
└────────┬────────────────┘
         │ HTTP/JSON
         ↓
┌─────────────────────────┐
│   Express Backend       │
│   (localhost:5001)      │
│   - API Routes          │
│   - JWT Middleware      │
│   - Business Logic      │
└────────┬────────────────┘
         │ SQL Queries
         ↓
┌─────────────────────────┐
│   PostgreSQL Database   │
│   - users table         │
│   - urls table          │
│   - clicks table        │
└─────────────────────────┘
```

### Authentication Flow
1. **Signup**:
   - User enters email/password in React form
   - Frontend sends POST to `/api/auth/signup`
   - Backend hashes password with bcryptjs
   - Backend saves user to PostgreSQL
   - Backend creates JWT token
   - Frontend stores token in localStorage

2. **Login**:
   - User enters email/password
   - Frontend sends POST to `/api/auth/login`
   - Backend queries user from database
   - Backend verifies password hash with bcryptjs
   - Backend creates JWT token
   - Frontend stores token and redirects to dashboard

3. **Protected Requests**:
   - Frontend sends JWT in Authorization header
   - Backend middleware verifies JWT signature
   - If valid, extracts user ID and allows request
   - If invalid, returns 401 Unauthorized

### URL Shortening Flow
1. **Create Short URL**:
   - User enters long URL in dashboard form
   - Frontend sends POST to `/api/urls/create` with JWT
   - Backend verifies JWT (authentication)
   - Backend generates random short code (e.g., `abc123`)
   - Backend saves to database: `user_id`, `short_code`, `original_url`
   - Backend returns short URL: `http://localhost:5001/abc123`
   - Frontend displays short URL to user

2. **Redirect Flow**:
   - Someone visits `http://localhost:5001/abc123`
   - Backend queries database for short code `abc123`
   - If found:
     - Backend records click (IP, user agent, timestamp) in `clicks` table
     - Backend increments click count
     - Backend sends 302 redirect to original URL
   - If not found: Returns 404 error

3. **Analytics**:
   - User clicks "Analytics" on dashboard
   - Frontend requests `/api/urls/:id/analytics` with JWT
   - Backend verifies JWT and ownership
   - Backend queries all clicks for that URL
   - Backend returns: total clicks, recent click data (IP, timestamp, referrer)
   - Frontend displays analytics charts/tables

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### URLs Table
```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  clicks INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Clicks Table
```sql
CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer TEXT
);
```

**Relationships**:
- One user has many URLs (one-to-many)
- One URL has many clicks (one-to-many)
- Cascade delete: Deleting a user deletes their URLs and all associated clicks

---

## Security Measures

### Password Security
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Never stored in plain text
- ✅ One-way encryption (cannot be decrypted)

### Authentication Security
- ✅ JWT tokens signed with secret key
- ✅ Tokens expire after set time (configurable)
- ✅ Middleware validates token on every protected route

### API Security
- ✅ CORS configured to only allow frontend origin
- ✅ SQL injection prevented with parameterized queries
- ✅ User can only access/modify their own URLs

### Input Validation
- ✅ Email format validation
- ✅ URL format validation
- ✅ Password strength requirements (can be enhanced)

---

## Development vs Production

### Development (Current Setup)
- Backend: `localhost:5001`
- Frontend: `localhost:3000`
- Database: Local PostgreSQL (`localhost:5432`)
- Hot reload enabled
- Detailed error messages
- No SSL required

### Production (When Deployed)
- Backend: Cloud platform (Railway, Render, Heroku)
- Frontend: Vercel, Netlify, or similar
- Database: Managed PostgreSQL (Railway, Supabase, etc.)
- Environment variables on hosting platform
- Minified/optimized builds
- HTTPS enforced
- Error logging service (optional)

---

## Why This Stack?

### Modern & Industry Standard
- React is the most popular frontend library
- Node.js + Express is proven for APIs
- PostgreSQL is trusted by major companies
- TypeScript is becoming the standard

### Full-Stack JavaScript
- Same language for frontend and backend
- Share types between client and server
- Easier context switching

### Free & Open Source
- All technologies are free
- Large communities for support
- Extensive documentation

### Portfolio-Ready
- Demonstrates modern development practices
- Shows understanding of authentication
- Proves database design skills
- Deployable to free hosting platforms

### Scalable
- PostgreSQL handles millions of rows
- JWT allows horizontal scaling (no server sessions)
- React components are reusable
- Easy to add features (QR codes, custom domains, etc.)

---

## How to Convert This to PDF

### Option 1: VS Code Extension
1. Install "Markdown PDF" extension in VS Code
2. Open this file
3. Right-click → "Markdown PDF: Export (pdf)"

### Option 2: Online Converter
1. Go to https://www.markdowntopdf.com/
2. Upload this file
3. Download PDF

### Option 3: Command Line (macOS)
```bash
# Install pandoc
brew install pandoc

# Convert to PDF
pandoc TECH_STACK.md -o TECH_STACK.pdf
```

### Option 4: Print to PDF
1. Open this file in a markdown viewer
2. Use browser "Print" function
3. Select "Save as PDF"

---

## Next Steps to Learn

1. **Add Testing**:
   - Jest for unit tests
   - React Testing Library for component tests
   - Supertest for API tests

2. **Add Redis**:
   - Cache frequently accessed URLs
   - Rate limiting for API endpoints

3. **Add WebSockets**:
   - Real-time analytics updates
   - Live click notifications

4. **Enhance Security**:
   - Rate limiting
   - Email verification
   - Password reset flow
   - 2FA (two-factor authentication)

5. **Advanced Features**:
   - QR code generation
   - Custom short codes
   - Link expiration
   - A/B testing
   - Link grouping/folders

---

**Document Created**: November 29, 2025  
**Project**: URL Shortener Full Stack Application  
**Status**: ✅ Fully working locally
