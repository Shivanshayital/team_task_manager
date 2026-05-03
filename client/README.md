# Team Task Manager - Frontend

React + Vite frontend for Team Task Manager application.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd client
npm install
\`\`\`

### 2. Configure Environment Variables
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file and set the API URL (default is already set to localhost):
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

For production:
\`\`\`
VITE_API_URL=https://your-backend-url/api
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The app will open at \`http://localhost:3000\`

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

## Features

### Pages

1. **Login/Signup** - Authentication pages
2. **Dashboard** - Overview of tasks and projects
3. **Projects** - Create and manage projects (Admin only)
4. **Tasks** - View and manage tasks

### Key Features

- Role-based access (Admin and Member)
- JWT authentication with local storage
- Responsive design
- Real-time status updates
- Task priority levels (Low, Medium, High)
- Deadline tracking
- Project member management

## API Integration

All API calls are handled through the `services/api.js` file using Axios.

- **Authentication**: Login, Signup, Get current user
- **Projects**: Create, Read, Update, Delete projects
- **Tasks**: Create, Read, Update, Delete tasks and manage status

## Directory Structure

\`\`\`
client/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── services/        # API services
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
├── package.json
└── .env.example
\`\`\`

## Technologies

- React 18 - UI library
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- CSS - Styling

## Deployment

### Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy the 'dist' folder to Netlify
\`\`\`

## Notes

- Make sure backend is running on port 5000
- Token is stored in localStorage
- All authenticated requests include the JWT token in headers
