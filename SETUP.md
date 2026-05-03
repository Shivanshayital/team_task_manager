# SETUP GUIDE - Team Task Manager

Complete step-by-step guide to get the application running locally.

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - Local MongoDB installed
  - MongoDB Atlas account (free cloud database)

## Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a M0 free cluster
5. Create a database user with a strong password
6. Add your IP to the whitelist (or use 0.0.0.0/0 for development)
7. Click "Connect" and copy the connection string
8. Replace `<db_name>` with `team_task_manager`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
```

### Option B: Local MongoDB

1. [Download MongoDB Community](https://www.mongodb.com/try/download/community)
2. Install and run MongoDB
3. Use connection string:
```
mongodb://localhost:27017/team_task_manager
```

## Step 2: Backend Setup

### 2.1 Navigate to server directory
```bash
cd server
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 Create .env file
```bash
cp .env.example .env
```

### 2.4 Edit .env with your values
```
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/team_task_manager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 2.5 Start the server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

✅ Backend is ready at `http://localhost:5000`

## Step 3: Frontend Setup

### 3.1 Open new terminal, navigate to client directory
```bash
cd client
```

### 3.2 Install dependencies
```bash
npm install
```

### 3.3 Create .env file
```bash
cp .env.example .env
```

### 3.4 Start development server
```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:3000/
```

✅ Frontend is ready at `http://localhost:3000`

## Step 4: First-Time Usage

### 4.1 Create an Account

1. Go to `http://localhost:3000`
2. Click "Sign up"
3. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
4. Click "Sign Up"

### 4.2 Create Admin Account (Optional)

To enable admin features:

1. Sign up normally as explained above
2. Open MongoDB Atlas or your MongoDB client
3. Go to database `team_task_manager`
4. Find the user in `users` collection
5. Change `role` from `"member"` to `"admin"`
6. Refresh the app

### 4.3 Test Admin Features

With admin account, you can now:
- Create projects
- Create tasks
- Assign tasks to team members
- Manage project members

### 4.4 Create Test Data

1. Create a project:
   - Go to "Projects"
   - Click "+ New Project"
   - Fill in project name and description
   - Click "Create Project"

2. Create a task:
   - Go to "Tasks"
   - Click "+ New Task"
   - Fill in task details
   - Select project
   - Set deadline and priority
   - Click "Create Task"

3. Update task status:
   - On Tasks page, use the dropdown to change status
   - Statuses: Pending → In Progress → Completed

## Troubleshooting

### MongoDB Connection Error
**Error**: `Can't connect to MongoDB`

**Solution**:
```bash
# Check MongoDB URI in .env
# For Atlas, ensure:
# 1. Correct username/password
# 2. IP is whitelisted
# 3. Database name is correct (team_task_manager)

# For local MongoDB:
mongod  # Start MongoDB service first
```

### Port Already in Use

**Error**: `Port 5000 already in use`

**Solution**:
```bash
# Use different port
# Edit server/.env
PORT=5001

# Or stop the process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### npm install fails

**Error**: `npm ERR!` during installation

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Frontend can't connect to backend

**Error**: API calls fail in frontend

**Solution**:
1. Check backend is running on port 5000
2. Verify VITE_API_URL in client/.env
3. Check browser console for CORS errors
4. Try refreshing the page

### CORS Error

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution**:
- Backend already has CORS enabled
- Make sure API_URL doesn't have trailing slash
- Clear browser cache

## Project File Structure

```
Team_Task_Manager/
├── server/
│   ├── config/db.js          ← Database connection
│   ├── models/               ← Database schemas
│   ├── controllers/          ← Business logic
│   ├── routes/               ← API endpoints
│   ├── middleware/           ← Auth & role checks
│   ├── server.js             ← Main file
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/           ← Page components
│   │   ├── components/      ← Reusable components
│   │   ├── services/        ← API calls
│   │   └── App.jsx          ← Main component
│   ├── vite.config.js
│   └── package.json
│
└── README.md                ← Full documentation
```

## Important Notes

1. **Token Storage**: Login token is stored in browser's localStorage
2. **Environment Variables**: Always use .env files, never hardcode secrets
3. **Development vs Production**: Modes are controlled by NODE_ENV
4. **Database**: MongoDB handles all data persistence
5. **Authentication**: JWT tokens expire after 7 days

## Useful Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start with auto-reload
npm start            # Start production
npm run build        # Build for production
```

### Frontend
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Testing the App

### Basic Flow

1. **Signup**: Create account
2. **Login**: Login with your credentials
3. **Dashboard**: View overview (as member)
4. **Projects**: View projects (show projects you're part of)
5. **Tasks**: View your tasks

### Admin Features (Requires admin role)

1. Make account admin (via MongoDB)
2. Go to Projects → Create new project
3. Go to Tasks → Create task for project
4. Assign task to team members
5. View task status updates from members

## Next Steps

### For Development
- Read [client/README.md](client/README.md) for frontend details
- Read [server/README.md](server/README.md) for backend details
- Explore the code and modify as needed

### For Production
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Set up MongoDB Atlas
- Deploy backend to Railway
- Deploy frontend to Vercel/Netlify

### Learning Resources
- Express.js: [expressjs.com](https://expressjs.com/)
- MongoDB: [docs.mongodb.com](https://docs.mongodb.com/)
- React: [react.dev](https://react.dev/)
- JWT: [jwt.io](https://jwt.io/)

## Need Help?

1. Check the error message carefully
2. Look for solutions in "Troubleshooting" section
3. Check console logs (browser DevTools + terminal)
4. Verify environment variables
5. Ensure all services are running

---

**You're all set! Start coding! 🚀**

Questions? Check the README files or deployment documentation.
