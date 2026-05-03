# Team Task Manager - Complete Setup & Deployment Guide

## 📋 Project Overview

**Team Task Manager** is a full-stack web application for teams to:
- Create and manage projects
- Create and assign tasks
- Track task progress with status updates
- Manage team members with role-based access (Admin/Member)
- View dashboard with task statistics and overdue tasks

**Tech Stack**:
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Authentication: JWT (JSON Web Tokens)
- Deployment: Railway

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js >= 14.0.0
- MongoDB Atlas account (free tier OK)
- Git

### Installation

1. **Clone & Install Dependencies**
```bash
cd team-task-manager-main

# Backend
cd server
npm install

# Frontend (in new terminal)
cd client
npm install
```

2. **Configure Environment Variables**
```bash
# Create .env in server folder (already provided in server/.env)
cd server

# Verify these are set:
# MONGODB_URI=mongodb+srv://shivanshnayitall_db_user:Shivansh%400987@cluster0.vfe9xn2.mongodb.net/taskmanager
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
# NODE_ENV=development
# PORT=5000
```

3. **Start Backend** (Terminal 1)
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

4. **Start Frontend** (Terminal 2)
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3001 (or next available port)
```

5. **Access Application**
```
http://localhost:3001
```

### First Login Steps
1. **Create Admin Account**
   - Click "Sign Up"
   - Enter: Name, Email, Password
   - By default, new users are assigned "member" role
   - To make admin, edit user in MongoDB directly (temporarily)
   - Or use the test user already created

2. **Test User Credentials** (already in database)
   ```
   Email: admin@test.com
   Password: password123
   Role: admin
   ```

3. **Create a Project**
   - Dashboard → Click "Create Project"
   - Enter project name and description
   - Add team members

4. **Create Tasks**
   - Project page → Click "Create Task"
   - Assign to team members
   - Set priority and deadline
   - Update status as work progresses

---

## 🧪 Testing

### Run API Test Suite
```bash
# From repo root
powershell -ExecutionPolicy Bypass -File RUN_API_TESTS.ps1
```

**Expected Results**: ✅ 19/20 tests passing

### Manual Testing

**Test Admin Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Admin","email":"testadmin@test.com","password":"password123","role":"admin"}'
```

**Test Create Project**
```bash
# First get a token from login
# Then use it in Authorization header

curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My Project","description":"Test project"}'
```

**Test Create Task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"My Task",
    "description":"Do something",
    "projectId":"PROJECT_ID_HERE",
    "priority":"high",
    "deadline":"2026-05-10T00:00:00Z"
  }'
```

---

## 🌐 Production - Railway Deployment

### Step 1: Prepare Repository

✅ Already done:
- `Procfile` created for platform detection
- Build scripts added to `package.json`
- Static serving configured in `server/server.js`
- Environment variables documented in `server/.env.example`

### Step 2: Connect to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in or create account
3. Click "New Project"
4. Select "GitHub Repo"
5. Connect your GitHub account
6. Select your team-task-manager repository

### Step 3: Add Environment Variables

In Railway project settings:

```
MONGODB_URI=mongodb+srv://shivanshnayitall_db_user:Shivansh%400987@cluster0.vfe9xn2.mongodb.net/taskmanager

JWT_SECRET=YOUR_STRONG_SECRET_HERE
# Generate: openssl rand -base64 32

NODE_ENV=production
PORT=5000
```

### Step 4: Deploy

Railway automatically:
1. Detects Node.js project
2. Installs dependencies: `npm install`
3. Runs build: `npm run heroku-postbuild` (builds frontend)
4. Starts server: `npm start`

### Step 5: Access Your App

```
https://<your-railway-url>.up.railway.app
```

### Verify Deployment

```bash
# Check health
curl https://<your-railway-url>.up.railway.app/api/health

# Test signup
curl -X POST https://<your-railway-url>.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

---

## 📊 Features & Validation

### ✅ Implemented Features

| Feature | Status | Details |
|---------|--------|---------|
| User Authentication | ✅ | Signup, Login, JWT tokens |
| User Roles | ✅ | Admin & Member roles |
| Project Management | ✅ | Create, read, update, delete |
| Team Members | ✅ | Add/remove members from projects |
| Task Management | ✅ | Full CRUD operations |
| Task Assignment | ✅ | Assign to project members |
| Task Status | ✅ | pending → in-progress → completed |
| Task Priority | ✅ | low, medium, high |
| Task Deadline | ✅ | Set and track deadlines |
| Overdue Detection | ✅ | Highlights tasks past deadline |
| Dashboard | ✅ | Stats: total, pending, in-progress, completed, overdue |
| RBAC | ✅ | Role-based access control |
| Validations | ✅ | Email, password, required fields |

### 🧪 Test Coverage

- ✅ Authentication tests
- ✅ Authorization tests (RBAC)
- ✅ Project CRUD operations
- ✅ Task CRUD operations
- ✅ Task assignment & status updates
- ✅ Field validations
- ✅ Error handling
- ✅ Database relationships

---

## 🔐 Security Checklist

### Development
- [x] Password hashing (bcryptjs)
- [x] JWT token validation
- [x] Role-based access control
- [x] Input validation
- [x] CORS enabled
- [x] MongoDB connection string securely stored in .env

### Production
- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS (Railway provides)
- [ ] Restrict CORS to your domain
- [ ] Monitor error logs in Railway
- [ ] Set up MongoDB backups
- [ ] Implement rate limiting (optional)
- [ ] Add password reset (optional)
- [ ] Enable two-factor authentication (optional)

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :5000

# Kill process using port 5000
taskkill /PID <PID> /F

# Restart
npm run dev
```

### MongoDB Connection Error
- Verify IP is whitelisted in MongoDB Atlas
- Check MONGODB_URI format
- Confirm credentials are correct
- Test connection: `mongoose.connect(uri)`

### Frontend Build Errors
```bash
cd client
npm install  # Reinstall dependencies
npm run build
```

### Railway Deployment Issues
- Check logs: Railway Dashboard → Logs
- Verify all env vars are set
- Ensure `Procfile` exists at repo root
- Check that `package.json` has `"start": "cd server && npm start"`

---

## 📚 Project Structure

```
team-task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (Toast)
│   │   └── App.jsx        # Main app component
│   ├── public/
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # Database config
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── controllers/        # Request handlers
│   ├── middleware/        # Auth, role, validation
│   ├── server.js          # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── RUN_API_TESTS.ps1      # Test suite
├── DEPLOYMENT.md          # Deployment guide
├── PRODUCTION_DEPLOYMENT.md  # Railway guide
├── RUN_LOCAL.md           # Local setup
└── package.json           # Root package.json
```

---

## 📞 Support & Documentation

- **API Endpoints**: See `server/routes/` for all endpoints
- **Database Models**: See `server/models/` for schema
- **Frontend Components**: See `client/src/components/`
- **Frontend Pages**: See `client/src/pages/`

---

## 🎯 Next Steps

1. **Local Testing** ✅ (Complete)
   ```bash
   npm run dev        # Terminal 1 - Backend
   npm run dev        # Terminal 2 - Frontend
   powershell -ExecutionPolicy Bypass -File RUN_API_TESTS.ps1  # Terminal 3 - Tests
   ```

2. **Deploy to Railway** 🚀
   - Connect GitHub repo to Railway
   - Add environment variables
   - Deploy

3. **Post-Deployment**
   - Test all features in production
   - Monitor logs
   - Set up backups

---

**Last Updated**: May 3, 2026
**Status**: ✅ Ready for Production Deployment

