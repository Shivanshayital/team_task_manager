# Team Task Manager

Complete full-stack web application for managing team projects and tasks.

## 🏗️ Project Structure

```
Team_Task_Manager/
├── server/                 # Node.js/Express backend
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── middleware/       # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── server.js         # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Projects.css
│   │   │   └── Tasks.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Backend

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
   JWT_SECRET=your_secret_key_change_this
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev  # Development with hot reload
   # or
   npm start    # Production
   ```

   Server will run on `http://localhost:5000`

### Setup Frontend

1. **Open new terminal and navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   App will open at `http://localhost:3000`

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed with bcryptjs
- Automatic token refresh handling
- Protected routes

### Login Credentials

Create a test account through the signup page or use:
- Email: admin@example.com (for admin role)
- Password: password123

## 👥 User Roles

### Admin
- Create/Delete/Update projects
- Create/Delete/Update tasks
- Assign tasks to team members
- Manage team members

### Member
- View assigned tasks
- Update task status
- View projects they're part of

## 📋 Features

### Authentication
- ✅ Signup / Login
- ✅ JWT-based sessions
- ✅ Password hashing with bcrypt
- ✅ Protected routes

### Project Management
- ✅ Create projects (Admin only)
- ✅ Edit project details
- ✅ Add/Remove team members
- ✅ Delete projects
- ✅ View all projects

### Task Management
- ✅ Create tasks (Admin only)
- ✅ Assign tasks to users
- ✅ Set priority levels (Low, Medium, High)
- ✅ Set deadlines
- ✅ Track task status (Pending, In Progress, Completed)
- ✅ Update task status
- ✅ Delete tasks

### Dashboard
- ✅ Task summary (Total, Pending, In Progress, Completed, Overdue)
- ✅ Overdue tasks highlight
- ✅ Recent projects
- ✅ Recent tasks

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users

### Projects
- `POST /api/projects` - Create project (Admin)
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get user projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members` - Remove member

### Tasks
- `POST /api/tasks` - Create task (Admin)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get user tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/stats/:projectId` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update status
- `DELETE /api/tasks/:id` - Delete task

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [ObjectId] (Users),
  createdAt: Date
}
```

### Task
```javascript
{
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

## 🚢 Deployment

### Backend (Railway)

1. Create account on [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!

### Frontend (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. **Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Netlify**: Deploy the `dist` folder to Netlify

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS

## 📝 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## ⚙️ Error Handling

- Global error handler in Express
- API error responses with status codes
- Frontend error display in alerts
- Automatic session expiration handling

## 🔒 Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT token expiration (7 days)
- Role-based access control (RBAC)
- Input validation on backend
- CORS enabled
- Protected routes on frontend

## 📚 Scripts

### Backend
```bash
npm start    # Start production server
npm run dev  # Start with nodemon
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT

## 💡 Tips

1. **First Admin Account**: Sign up a user and manually change their role in MongoDB
2. **Test Data**: Create test projects and tasks from the admin dashboard
3. **Local Development**: Keep backend running in one terminal, frontend in another
4. **API Testing**: Use Postman or Thunder Client to test API endpoints

## ❓ Troubleshooting

### MongoDB Connection Error
- Check connection string in `.env`
- Ensure MongoDB is running
- Verify username/password credentials

### JWT Token Errors
- Clear localStorage and re-login
- Check JWT_SECRET is consistent

### Email Already Registered
- Use a different email or delete the user from MongoDB

### CORS Errors
- Ensure backend is running on correct port
- Check VITE_API_URL in frontend .env

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Happy Coding! 🎉**
