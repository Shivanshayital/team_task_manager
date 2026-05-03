# Quick Reference Guide

## ⚡ Quick Start (5 Minutes)

### Terminal 1: Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

### Then
- Open http://localhost:3000
- Sign up with any email/password
- Test the app!

## 🔐 Authentication

### Signup
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
// Returns: { token, user }
```

### How to Use Token
```javascript
Authorization: Bearer {token}
```

## 📋 Projects API

### Create Project (Admin Only)
```javascript
POST /api/projects
Authorization: Bearer {token}

{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "members": ["userId1", "userId2"]
}
```

### Get All Projects
```javascript
GET /api/projects
Authorization: Bearer {token}
```

### Get My Projects
```javascript
GET /api/projects/my-projects
Authorization: Bearer {token}
```

### Update Project
```javascript
PUT /api/projects/{id}
Authorization: Bearer {token}

{
  "name": "New Name",
  "description": "New description"
}
```

### Delete Project
```javascript
DELETE /api/projects/{id}
Authorization: Bearer {token}
```

### Add Member to Project
```javascript
POST /api/projects/{id}/members
Authorization: Bearer {token}

{
  "userId": "userId"
}
```

### Remove Member from Project
```javascript
DELETE /api/projects/{id}/members
Authorization: Bearer {token}

{
  "userId": "userId"
}
```

## ✅ Tasks API

### Create Task (Admin Only)
```javascript
POST /api/tasks
Authorization: Bearer {token}

{
  "title": "Design homepage",
  "description": "Create homepage mockup",
  "projectId": "projectId",
  "assignedTo": "userId",
  "deadline": "2024-12-31",
  "priority": "high"
}
```

### Get All Tasks
```javascript
GET /api/tasks
Authorization: Bearer {token}
```

### Get My Tasks
```javascript
GET /api/tasks/my-tasks
Authorization: Bearer {token}
```

### Get Project Tasks
```javascript
GET /api/tasks/project/{projectId}
Authorization: Bearer {token}
```

### Update Task
```javascript
PUT /api/tasks/{id}
Authorization: Bearer {token}

{
  "title": "New title",
  "status": "in-progress",
  "priority": "medium"
}
```

### Update Task Status
```javascript
PATCH /api/tasks/{id}/status
Authorization: Bearer {token}

{
  "status": "completed"  // pending, in-progress, completed
}
```

### Delete Task
```javascript
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

### Get Task Statistics
```javascript
GET /api/tasks/stats/{projectId}
Authorization: Bearer {token}

// Returns: { total, pending, inProgress, completed, overdue }
```

## 👥 Users API

### Get All Users
```javascript
GET /api/auth/users
Authorization: Bearer {token}
```

### Get Current User
```javascript
GET /api/auth/me
Authorization: Bearer {token}
```

## 📊 Response Format

### Success Response
```javascript
{
  "message": "Success message",
  "data": { /* data */ },
  "token": "jwt_token" // Only in auth endpoints
}
```

### Error Response
```javascript
{
  "message": "Error message"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🔄 Frontend API Usage

### Login
```javascript
import { authAPI } from '../services/api';

const response = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});

localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Get Projects
```javascript
import { projectAPI } from '../services/api';

const response = await projectAPI.getUserProjects();
console.log(response.data.projects);
```

### Create Task
```javascript
import { taskAPI } from '../services/api';

const response = await taskAPI.createTask({
  title: 'New Task',
  projectId: 'projectId',
  deadline: '2024-12-31',
  priority: 'high'
});
```

### Update Task Status
```javascript
await taskAPI.updateTaskStatus(taskId, 'completed');
```

## 💾 Database Collections

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date
}
```

### Projects
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [ObjectId],
  createdAt: Date
}
```

### Tasks
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  assignedTo: ObjectId (User),
  projectId: ObjectId (Project),
  createdBy: ObjectId (User),
  deadline: Date,
  createdAt: Date
}
```

## 🛠️ Common Tasks

### Make User Admin (MongoDB)

```javascript
// In MongoDB Compass or MongoDB Atlas
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Reset Password

Users need to sign up again with new account.

### Delete All Test Data

```javascript
// In MongoDB
db.projects.deleteMany({})
db.tasks.deleteMany({})
db.users.deleteMany({})
```

## 📝 Postman Collection

You can import this into Postman:

```json
{
  "info": {
    "name": "Team Task Manager API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/signup",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

## ⚙️ Environment Variables Recap

### Server
```
PORT=5000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Client
```
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Debug Tips

1. **Check browser console** - Look for Frontend errors
2. **Check terminal** - Look for backend errors
3. **Check Network tab** - See API requests/responses
4. **Clear localStorage** - Delete token and try again
5. **Check MongoDB** - Verify data is being saved
6. **Check .env files** - Ensure correct configuration

## 🚀 Deployment Quick Check

- [ ] MongoDB Atlas cluster created
- [ ] Backend environment variables set
- [ ] Frontend build runs without errors: `npm run build`
- [ ] VITE_API_URL points to production backend
- [ ] All features tested on production
- [ ] Error monitoring set up (optional)

---

**Print this page for quick reference! 📠**
