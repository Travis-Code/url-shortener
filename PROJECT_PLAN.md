# URL Shortener - Project Plan

## Project Overview

**Project Name:** Production-Ready URL Shortener  
**Type:** Full-Stack Portfolio Application  
**Timeline:** 6-8 weeks (development complete, deployment pending)  
**Repository:** https://github.com/Travis-Code/url-shortener  
**Status:** ✅ Development Complete | 🔄 Deployment Pending

---

## Goals & Success Criteria

### Primary Goals
1. **Demonstrate full-stack proficiency** with modern tech stack
2. **Showcase production-ready practices** (security, testing, CI/CD)
3. **Create interview-ready portfolio piece** with comprehensive documentation
4. **Deploy live application** accessible via public URL

### Success Criteria
- ✅ All core features functional (auth, URL shortening, analytics)
- ✅ CI/CD pipeline with quality gates
- ✅ Comprehensive test coverage (unit + smoke tests)
- ✅ Production security measures implemented
- 🔄 Deployed to production environment
- 🔄 Performance metrics documented
- 🔄 Portfolio documentation complete

---

## Project Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE

**Epic:** Project Setup & Core Infrastructure

#### Completed Tasks
- [x] Initialize monorepo structure (client + server)
- [x] Configure TypeScript for both frontend and backend
- [x] Set up PostgreSQL database
- [x] Design normalized database schema (users, urls, clicks)
- [x] Implement database connection pooling
- [x] Create seed script with test data
- [x] Set up Express server with middleware
- [x] Configure Vite + React + Tailwind CSS
- [x] Environment variable management (.env files)

#### Key Deliverables
- `server/` - Backend TypeScript project
- `client/` - React frontend project
- `server/src/db/init.ts` - Database schema
- `server/src/db/pool.ts` - Connection pool
- `.env.example` files for configuration

---

### Phase 2: Authentication System (Week 2-3) ✅ COMPLETE

**Epic:** User Authentication & Authorization

#### Completed Tasks
- [x] User registration with email validation
- [x] Password hashing with bcryptjs
- [x] JWT token generation and validation
- [x] Login endpoint with credential verification
- [x] Protected route middleware
- [x] Admin role implementation
- [x] Frontend auth context provider
- [x] Login/Signup pages with form validation
- [x] Protected route component wrapper
- [x] Token refresh strategy (manual for now)

#### Key Deliverables
- `server/src/routes/auth.ts` - Auth endpoints
- `server/src/middleware/auth.ts` - JWT verification
- `server/src/middleware/admin.ts` - Admin guard
- `client/src/utils/authContext.tsx` - Auth state management
- `client/src/pages/Login.tsx` & `Signup.tsx`
- `client/src/components/ProtectedRoute.tsx`

#### Security Measures
- Password strength requirements
- JWT with expiration (24h)
- HTTP-only cookies (consideration for future)
- Rate limiting on auth endpoints

---

### Phase 3: URL Shortening Core (Week 3-4) ✅ COMPLETE

**Epic:** URL Management & Redirection

#### Completed Tasks
- [x] Create short URL endpoint (random + custom codes)
- [x] Short code collision detection
- [x] URL validation and sanitization
- [x] Redirect endpoint with tracking
- [x] List user's URLs
- [x] Edit URL (destination, custom code)
- [x] Delete URL
- [x] Click tracking on redirect
- [x] Frontend URL creation form
- [x] Dashboard with URL list
- [x] Copy-to-clipboard functionality

#### Key Deliverables
- `server/src/routes/urls.ts` - URL CRUD operations
- `server/src/utils/helpers.ts` - Short code generation
- `client/src/pages/Dashboard.tsx` - URL management UI
- `client/src/pages/Home.tsx` - Public creation form

#### Technical Decisions
- Short codes: 6-character alphanumeric (62^6 = 56B combinations)
- Case-sensitive short codes
- Soft delete strategy (URLs marked inactive vs. hard delete)
- Owner-only edit/delete restrictions

---

### Phase 4: Analytics & Tracking (Week 4-5) ✅ COMPLETE

**Epic:** Click Analytics & Insights

#### Completed Tasks
- [x] Click event logging to database
- [x] Geolocation tracking (geoip-lite)
- [x] User-agent parsing (ua-parser-js)
- [x] Device type, OS, browser extraction
- [x] Referrer tracking
- [x] Click aggregation endpoint
- [x] Geolocation breakdown API
- [x] User-agent breakdown API
- [x] Analytics dashboard UI
- [x] Click count display per URL
- [x] Database indexes for performance

#### Key Deliverables
- `server/src/db/migrations/add_geolocation.ts`
- `server/src/db/migrations/add_useragent_breakdown.ts`
- `client/src/pages/Analytics.tsx`
- Click tracking on every redirect

#### Data Collected
- Timestamp
- IP address (hashed for privacy consideration)
- Country, city (from GeoIP)
- Device type (mobile, desktop, tablet)
- Operating system
- Browser
- Referrer URL

---

### Phase 5: Security Hardening (Week 5) ✅ COMPLETE

**Epic:** Production Security & Rate Limiting

#### Completed Tasks
- [x] Helmet.js for security headers
- [x] XSS protection middleware
- [x] Rate limiting (100 req/15min per IP)
- [x] CORS configuration
- [x] SQL injection prevention (parameterized queries)
- [x] Input validation and sanitization
- [x] JWT secret rotation capability
- [x] Environment variable security
- [x] Error handling (no stack traces in production)
- [x] Admin-only routes protection

#### Key Deliverables
- `server/src/app.ts` - Security middleware stack
- Global error handler
- Request logging with sanitization

#### Security Checklist
- ✅ No secrets in repository
- ✅ Password hashing (bcrypt rounds: 10)
- ✅ JWT expiration enforced
- ✅ SQL queries parameterized
- ✅ User input sanitized
- ✅ HTTPS required in production
- ✅ Rate limiting active
- ✅ Security headers configured

---

### Phase 6: Admin Dashboard (Week 5-6) ✅ COMPLETE

**Epic:** Administrative Interface

#### Completed Tasks
- [x] Admin role in database schema
- [x] Admin middleware guard
- [x] List all users endpoint
- [x] List all URLs endpoint
- [x] List all clicks endpoint
- [x] User management UI
- [x] URL management UI (view all)
- [x] Click logs viewer
- [x] Admin-only navigation

#### Key Deliverables
- `server/src/routes/admin.ts`
- `client/src/pages/Admin.tsx`
- Admin seed user (admin@example.com)

#### Future Enhancements
- Pagination for large datasets
- User suspension/activation
- Bulk operations (delete multiple URLs)
- Analytics export (CSV)

---

### Phase 7: Testing & CI/CD (Week 6-7) ✅ COMPLETE

**Epic:** Automated Testing & Continuous Integration

#### Completed Tasks
- [x] Jest + ts-jest configuration
- [x] Supertest for API testing
- [x] Unit tests for auth flow
- [x] Unit tests for URL CRUD
- [x] Server smoke test (health check)
- [x] Client smoke test (scaffold validation)
- [x] Build artifact verification
- [x] GitHub Actions workflow
- [x] Branch protection rules
- [x] CI job for builds and tests
- [x] Smoke test runner script
- [x] CI failure debugging (shebang fix)

#### Key Deliverables
- `server/test/auth_and_urls.test.ts`
- `server/test/smoke.js`
- `client/test/smoke.js`
- `scripts/smoke.sh`
- `.github/workflows/ci.yml`
- `CI_GUIDE.md` - Comprehensive CI documentation

#### CI Pipeline
```
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (server + client)
4. Build TypeScript (server)
5. Build React app (client)
6. Run unit tests
7. Run smoke tests
8. Verify build artifacts
```

#### Test Coverage
- Auth: Signup, login, protected routes
- URLs: Create, read, update, delete
- Smoke: Server boot, client scaffold, build output

---

### Phase 8: Observability (Week 7) ✅ COMPLETE

**Epic:** Logging & Debugging Infrastructure

#### Completed Tasks
- [x] Structured JSON logging
- [x] Log levels (info, warn, error)
- [x] Correlation ID middleware (16-char hex)
- [x] Request/response logging
- [x] Error logging with stack traces
- [x] Health check endpoint
- [x] Database diagnostics endpoint
- [x] Process-level error handlers

#### Key Deliverables
- `server/src/utils/logger.ts`
- `server/src/routes/diagnostics.ts`
- Correlation ID in all logs
- `/api/health` - Application health
- `/api/diagnostics/db` - Database connectivity

#### Log Format
```json
{
  "level": "info",
  "message": "Request received",
  "correlationId": "a3f9d8e2c4b1",
  "method": "POST",
  "path": "/api/urls",
  "timestamp": 1701234567890
}
```

---

### Phase 9: Documentation (Week 7-8) ✅ COMPLETE

**Epic:** Project Documentation & Interview Preparation

#### Completed Tasks
- [x] Main README with setup instructions
- [x] Tech stack documentation
- [x] Security considerations guide
- [x] CI/CD setup guide (comprehensive)
- [x] Testing strategy documentation
- [x] Troubleshooting guide
- [x] Environment variable documentation
- [x] API endpoint documentation (inline)
- [x] Database schema documentation
- [x] Jira workflow guide
- [x] Project plan (this document)

#### Key Deliverables
- `README.md` - Setup and features
- `TECH_STACK.md` - Technology choices
- `SECURITY.md` - Security practices
- `CI_GUIDE.md` - CI/CD walkthrough
- `.github/copilot-instructions.md` - Project context

#### Interview Preparation
- Feature highlights documented
- Technical decisions explained
- Talking points for common questions
- Code examples for key patterns

---

### Phase 10: Deployment (Week 8) 🔄 IN PROGRESS

**Epic:** Production Deployment & Launch

#### Planned Tasks
- [ ] Set up Railway project
- [ ] Provision PostgreSQL database on Railway
- [ ] Configure environment variables in Railway
- [ ] Deploy backend to Railway
- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Deploy frontend to Vercel
- [ ] Connect frontend to production API
- [ ] Run database migrations in production
- [ ] Seed production database (admin user)
- [ ] Test end-to-end in production
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets

#### Deployment Architecture
```
┌─────────────────┐
│   Vercel        │  Frontend (React)
│   (CDN Edge)    │  https://urlshort.vercel.app
└────────┬────────┘
         │
         │ HTTPS API calls
         │
         ▼
┌─────────────────┐
│   Railway       │  Backend (Express)
│   Container     │  https://api.urlshort.railway.app
└────────┬────────┘
         │
         │ PostgreSQL connection
         │
         ▼
┌─────────────────┐
│   Railway       │  PostgreSQL Database
│   Postgres      │  (Private network)
└─────────────────┘
```

#### Deployment Checklist
- [ ] Backend health check responding
- [ ] Database migrations applied
- [ ] Frontend can reach backend API
- [ ] CORS configured for production domains
- [ ] Environment variables secured
- [ ] Rate limiting active
- [ ] Logging aggregation configured
- [ ] SSL/TLS enabled
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Performance monitoring (optional: New Relic)

#### Post-Deployment
- [ ] Load testing (optional)
- [ ] Security audit (OWASP Top 10)
- [ ] Performance benchmarks
- [ ] Uptime monitoring
- [ ] Backup strategy for database

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Database migration failure | High | Test migrations locally, backup before production deploy | ✅ Mitigated |
| JWT secret leak | Critical | Never commit secrets, use Railway/Vercel secrets manager | ✅ Mitigated |
| Rate limit bypass | Medium | Multiple rate limit strategies (IP, user, endpoint) | ✅ Implemented |
| Short code collision | Low | 62^6 combinations, collision detection in place | ✅ Mitigated |
| CI/CD pipeline failure | Medium | Smoke tests, branch protection, manual deploy fallback | ✅ Mitigated |
| Production downtime | High | Health checks, process managers, Railway auto-restart | 🔄 Pending deployment |

### Operational Risks

| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Cost overruns (hosting) | Low | Free tier sufficient for portfolio (Railway + Vercel) | 🔄 Monitoring |
| Database storage limits | Low | Click data cleanup script, pagination | ✅ Script ready |
| API abuse | Medium | Rate limiting, user quotas (future enhancement) | ✅ Basic protection |
| Data loss | High | Regular backups, transaction safety | 🔄 Backup strategy TBD |

---

## Resource Requirements

### Development Tools
- ✅ Node.js 18.x
- ✅ PostgreSQL 14+
- ✅ VS Code + extensions
- ✅ Git + GitHub account
- ✅ Postman/Thunder Client (API testing)

### Hosting/Services
- 🔄 Railway account (backend + database)
- 🔄 Vercel account (frontend)
- ✅ GitHub (repository + CI/CD)
- Optional: Custom domain ($12/year)

### Time Investment
- Development: ~60-80 hours
- Documentation: ~10-15 hours
- Deployment: ~5-10 hours
- **Total:** ~75-105 hours

---

## Project Milestones

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| Project kickoff | Week 1 | ✅ Complete | Repo initialized |
| Database schema finalized | Week 2 | ✅ Complete | Migrations ready |
| Authentication working | Week 3 | ✅ Complete | JWT implemented |
| URL shortening functional | Week 4 | ✅ Complete | CRUD complete |
| Analytics dashboard | Week 5 | ✅ Complete | Geo + UA tracking |
| Security hardened | Week 5 | ✅ Complete | Rate limits, helmet |
| CI/CD pipeline live | Week 7 | ✅ Complete | GitHub Actions |
| Documentation complete | Week 8 | ✅ Complete | All guides written |
| **Production deployment** | **Week 8** | **🔄 In Progress** | Railway + Vercel |
| Portfolio presentation ready | Week 8 | 🔄 Pending | After deployment |

---

## Team Structure

**Solo Developer:** You (Full-Stack Engineer)

**Responsibilities:**
- Backend API development
- Frontend UI/UX implementation
- Database design and migrations
- DevOps (CI/CD, deployment)
- Documentation and testing
- Security hardening
- Performance optimization

**Skills Demonstrated:**
- TypeScript (backend + frontend)
- React (modern hooks, context)
- Node.js/Express (REST API design)
- PostgreSQL (schema design, indexing)
- Git/GitHub (version control, workflows)
- CI/CD (GitHub Actions)
- Security (auth, rate limiting, input validation)
- Testing (unit tests, smoke tests)

---

## Sprint Breakdown (Agile Approach)

### Sprint 1 (Week 1-2): Foundation ✅
**Goal:** Scaffolding and database setup  
**Story Points:** 21  
**Outcome:** Dev environment ready, database schema complete

### Sprint 2 (Week 2-3): Authentication ✅
**Goal:** User auth end-to-end  
**Story Points:** 13  
**Outcome:** Login/signup functional, JWT working

### Sprint 3 (Week 3-4): Core Features ✅
**Goal:** URL shortening + redirection  
**Story Points:** 21  
**Outcome:** Short URLs working, dashboard UI complete

### Sprint 4 (Week 4-5): Analytics ✅
**Goal:** Click tracking and insights  
**Story Points:** 13  
**Outcome:** Analytics page with geo/UA data

### Sprint 5 (Week 5-6): Security + Admin ✅
**Goal:** Harden security, admin features  
**Story Points:** 13  
**Outcome:** Rate limiting active, admin dashboard

### Sprint 6 (Week 6-7): Testing + CI/CD ✅
**Goal:** Automated testing pipeline  
**Story Points:** 13  
**Outcome:** CI passing, branch protection enabled

### Sprint 7 (Week 7-8): Observability + Docs ✅
**Goal:** Logging and documentation  
**Story Points:** 8  
**Outcome:** Correlation IDs, comprehensive guides

### Sprint 8 (Week 8): Deployment 🔄
**Goal:** Production launch  
**Story Points:** 8  
**Outcome:** Live application accessible publicly

**Total Story Points:** ~110  
**Velocity:** ~13-15 points/sprint

---

## Success Metrics

### Technical Metrics
- ✅ Test coverage: 70%+ (auth + URL routes)
- ✅ CI build time: <2 minutes
- ✅ Smoke test time: <10 seconds
- 🔄 API response time: <200ms (p95)
- 🔄 Database query time: <50ms (p95)
- 🔄 Frontend load time: <2 seconds (LCP)

### Business Metrics
- 🔄 Production uptime: 99%+
- 🔄 Zero security vulnerabilities
- ✅ Zero secrets in repository
- 🔄 Cost: <$10/month (free tier priority)

### Portfolio Metrics
- ✅ Complete README with setup instructions
- ✅ Live demo link (pending deployment)
- ✅ CI/CD badge showing passing build
- ✅ Comprehensive documentation
- ✅ Interview talking points prepared

---

## Next Steps (Post-Deployment)

### Phase 11: Enhancements (Optional)
- [ ] Password reset via email (SendGrid/Postman)
- [ ] QR code generation for short URLs
- [ ] URL expiration feature
- [ ] Custom domain for short URLs
- [ ] Batch URL creation (CSV import)
- [ ] Click heatmap visualization
- [ ] API rate quotas per user tier
- [ ] Webhook notifications for click milestones
- [ ] A/B testing for multiple destinations
- [ ] Dark mode toggle

### Phase 12: Interview Preparation
- [ ] Record demo video (2-3 minutes)
- [ ] Prepare architecture diagram
- [ ] Practice explaining tech decisions
- [ ] Create slide deck (optional)
- [ ] Add to portfolio website
- [ ] Update resume with project details
- [ ] Prepare for common interview questions

### Phase 13: Maintenance
- [ ] Monitor error rates
- [ ] Review logs weekly
- [ ] Database cleanup script (old clicks)
- [ ] Dependency updates (npm audit)
- [ ] Performance profiling
- [ ] Security patch monitoring

---

## Interview Talking Points

### Architecture
> "I designed this as a monorepo with separate client and server directories. The backend is a RESTful API in Express with TypeScript, and the frontend is React 18 with Vite. I chose PostgreSQL for the relational data model—users own URLs, URLs have many clicks—and normalized the schema to 3NF."

### Security
> "Security was a priority from day one. I implemented JWT authentication with bcrypt password hashing, added helmet for security headers, rate limiting to prevent abuse, and XSS protection middleware. All user input is validated and sanitized, and I use parameterized queries to prevent SQL injection."

### CI/CD
> "I set up a GitHub Actions pipeline that runs on every push and PR. It builds both the client and server, runs unit tests with Jest, and executes smoke tests to verify the app actually boots and responds to health checks. Branch protection ensures nothing gets merged unless CI passes."

### Observability
> "For debugging, I added correlation IDs to every request—16-character hex identifiers that flow through all logs. This means if a user reports an error, I can search for that correlation ID and see the entire request lifecycle. All logs are structured JSON for easy parsing."

### Analytics
> "I implemented click tracking with geolocation and user-agent parsing. Every redirect logs the country, city, device type, OS, and browser. I used geoip-lite for IP lookup and ua-parser-js for user-agent breakdown. The analytics dashboard shows this data aggregated by URL."

### Testing Strategy
> "I follow the test pyramid: lots of unit tests for business logic, smoke tests for critical paths, and minimal E2E. Unit tests cover auth flows and URL CRUD. Smoke tests verify the server boots and the client builds successfully. They run in under 10 seconds, giving fast feedback."

### Technical Debt
> "I've documented future enhancements like pagination for the admin dashboard, password reset via email, and caching for frequently accessed URLs. I prioritized MVP features first, but the codebase is structured to add these without major refactoring."

### Challenges Overcome
> "One challenge was ensuring the CI pipeline worked across environments. My smoke test script originally used zsh, which failed on Ubuntu CI runners. I switched to bash and added proper error handling with `set -e` to fail fast. This taught me to test scripts in CI-like environments."

---

## Jira Board Structure

### Columns (Kanban)
1. **Backlog** - Future enhancements
2. **To Do** - Prioritized for current sprint
3. **In Progress** - Actively being worked on
4. **In Review** - PR open, awaiting CI
5. **Done** - Merged to main

### Epics
- `AUTH` - Authentication & User Management
- `URLS` - URL Shortening Core
- `ANALYTICS` - Click Tracking & Insights
- `DEVOPS` - CI/CD & Testing
- `SECURITY` - Security Hardening
- `ADMIN` - Admin Dashboard
- `OBS` - Observability & Logging
- `DEPLOY` - Production Deployment
- `DOCS` - Documentation

### Labels
- `frontend` / `backend` / `infra`
- `security` / `performance` / `bug`
- `smoke-fail` (CI smoke test failed)
- `blocked` (dependency or blocker)

---

## Project Retrospective (After Deployment)

### What Went Well
- Comprehensive planning from day one
- Iterative development with clear milestones
- CI/CD prevented regressions
- Documentation as we built (not afterthought)
- Security prioritized early

### What Could Improve
- Earlier focus on observability (correlation IDs sooner)
- Pagination should have been in MVP
- More edge case testing (rate limit edge cases)
- Performance benchmarking earlier

### Lessons Learned
- Smoke tests catch integration issues unit tests miss
- CI environment differences matter (zsh vs bash)
- Structured logging is worth the setup time
- Branch protection + required checks enforce quality

---

## Budget & Costs

### Development (Time)
- **Your Time:** $0 (portfolio project)
- **Estimated Hours:** 75-105 hours
- **Hourly Rate (if billing):** $75-150/hr
- **Value:** $5,625 - $15,750

### Hosting (Monthly)
- **Railway:** $0 (free tier: 500 hours, 512 MB RAM)
- **Vercel:** $0 (free tier: 100 GB bandwidth)
- **PostgreSQL:** $0 (included with Railway free tier)
- **Domain (optional):** $1/month ($12/year)
- **Total:** ~$0-1/month

### Tools & Services
- **GitHub:** $0 (free public repo)
- **VS Code:** $0 (free)
- **Node.js:** $0 (free)
- **PostgreSQL:** $0 (free)

---

## Appendix

### Key Files Reference
```
FullStackProject/
├── server/
│   ├── src/
│   │   ├── app.ts              # Express app setup
│   │   ├── index.ts            # Server entry point
│   │   ├── routes/
│   │   │   ├── auth.ts         # Auth endpoints
│   │   │   ├── urls.ts         # URL CRUD
│   │   │   ├── admin.ts        # Admin routes
│   │   │   └── diagnostics.ts # Health checks
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT verification
│   │   │   └── admin.ts        # Admin guard
│   │   ├── db/
│   │   │   ├── init.ts         # Schema definition
│   │   │   ├── pool.ts         # Connection pool
│   │   │   └── migrations/     # DB migrations
│   │   └── utils/
│   │       ├── logger.ts       # Structured logging
│   │       └── helpers.ts      # Utilities
│   └── test/
│       ├── auth_and_urls.test.ts  # Unit tests
│       └── smoke.js            # Server smoke test
├── client/
│   ├── src/
│   │   ├── App.tsx             # React router
│   │   ├── main.tsx            # Entry point
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Login.tsx       # Login form
│   │   │   ├── Signup.tsx      # Signup form
│   │   │   ├── Dashboard.tsx   # URL management
│   │   │   ├── Analytics.tsx   # Click insights
│   │   │   └── Admin.tsx       # Admin panel
│   │   ├── utils/
│   │   │   └── authContext.tsx # Auth state
│   │   └── api/
│   │       └── client.ts       # Axios instance
│   └── test/
│       └── smoke.js            # Client smoke test
├── scripts/
│   └── smoke.sh                # Smoke test runner
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions
├── README.md                   # Main documentation
├── CI_GUIDE.md                 # CI/CD walkthrough
├── TECH_STACK.md               # Tech decisions
├── SECURITY.md                 # Security practices
└── PROJECT_PLAN.md             # This document
```

### Environment Variables
**Server:**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/url_shortener
JWT_SECRET=<64-char-hex>
PORT=5001
NODE_ENV=development
```

**Client:**
```
VITE_API_URL=http://localhost:5001
```

### Common Commands
```bash
# Backend
cd server
npm install
npm run dev      # Start dev server
npm run build    # Compile TypeScript
npm test         # Run unit tests
npm run smoke    # Run smoke test
npm run seed     # Seed database

# Frontend
cd client
npm install
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm test         # Run smoke test

# Root
npm run smoke:all  # Run all smoke tests

# Database
createdb url_shortener
psql url_shortener -f server/src/db/init.sql
```

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Status:** Development complete, deployment in progress  
**Next Review:** After production deployment
