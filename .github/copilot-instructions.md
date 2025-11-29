## URL Shortener - Full Stack Portfolio Project

This is a production-ready full-stack application designed to get you hired as a software developer. The project demonstrates:

- **Full-stack proficiency** (React + Node.js + PostgreSQL)
- **Modern development practices** (TypeScript, authentication, API design)
- **Database design** (normalized schema with proper relationships)
- **Real-world features** (user auth, analytics, click tracking)
- **Deployment-ready** (can be deployed to Vercel + Railway)

### Project Setup Checklist

- [x] Backend scaffolding with Express + TypeScript
- [x] Frontend scaffolding with React + Vite
- [x] Database schema with PostgreSQL
- [x] Authentication system (JWT + password hashing)
- [x] API routes and middleware
- [x] React components and routing
- [x] Styling with Tailwind CSS
- [x] Complete documentation

### Getting Started

**Backend:**
```bash
cd server
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Next Phase: Deploy Live

To showcase this project to hiring managers:

1. Deploy backend to Railway (https://railway.app)
2. Deploy frontend to Vercel (https://vercel.com)
3. Update environment variables for production
4. Add to GitHub with detailed README
5. Include link in portfolio

### Features to Highlight in Interviews

✅ User authentication with JWT
✅ PostgreSQL database with proper schema
✅ RESTful API design
✅ Error handling and validation
✅ Protected routes
✅ Real-time analytics
✅ Responsive UI with Tailwind CSS
✅ Click tracking with metadata

### Key Files

- **Backend API**: `/server/src/index.ts` - Express server setup
- **Frontend App**: `/client/src/App.tsx` - React routing
- **Database**: `/server/src/db/init.ts` - Schema definition
- **Auth**: `/server/src/routes/auth.ts` - Login/Signup
- **URLs**: `/server/src/routes/urls.ts` - URL CRUD & analytics

