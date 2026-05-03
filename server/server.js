import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Helpers for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const clientIndexPath = path.join(clientBuildPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexPath);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve frontend in production (single-repo deploy)
if (process.env.NODE_ENV === 'production' && hasClientBuild) {
  app.use(express.static(clientBuildPath));

  // Return index.html for any non-API route so client-side routing works
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(clientIndexPath);
  });
} else if (process.env.NODE_ENV === 'production') {
  console.warn(`Frontend build not found at ${clientIndexPath}`);
}

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  // If production and static served, let client handle routes
  if (process.env.NODE_ENV === 'production' && hasClientBuild && !req.originalUrl.startsWith('/api')) {
    return res.sendFile(clientIndexPath);
  }

  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
