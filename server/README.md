# Team Task Manager - Backend

Complete Node.js/Express backend for Team Task Manager application.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd server
npm install
\`\`\`

### 2. Configure Environment Variables
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file and add:
- MongoDB connection string
- JWT secret key

### 3. Start the Server

**Development mode (with auto-reload):**
\`\`\`bash
npm run dev
\`\`\`

**Production mode:**
\`\`\`bash
npm start
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `GET /api/auth/users` - Get all users (Protected)

### Projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get user projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members` - Remove member

### Tasks
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get user tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/stats/:projectId` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task

## Architecture

- **Models**: User, Project, Task schemas
- **Controllers**: Business logic for each resource
- **Routes**: API endpoints
- **Middleware**: Authentication and role-based access control
- **Config**: Database connection setup

## Technologies

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests
