import express from 'express';
import * as projectController from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// Admin only - create project
router.post('/', roleMiddleware('admin'), projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get user projects
router.get('/my-projects', projectController.getUserProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Update project (Owner or Admin)
router.put('/:id', projectController.updateProject);

// Delete project (Owner or Admin)
router.delete('/:id', projectController.deleteProject);

// Add member
router.post('/:id/members', projectController.addMember);

// Remove member
router.delete('/:id/members', projectController.removeMember);

export default router;
