import express from 'express';
import * as taskController from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Admin only - create task
router.post('/', roleMiddleware('admin'), taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get user tasks
router.get('/my-tasks', taskController.getUserTasks);

// Get project tasks
router.get('/project/:projectId', taskController.getProjectTasks);

// Get task stats
router.get('/stats/:projectId', taskController.getTaskStats);

// Get single task
router.get('/:id', taskController.getTask);

// Update task
router.put('/:id', taskController.updateTask);

// Update task status
router.patch('/:id/status', taskController.updateTaskStatus);

// Delete task (Creator or Admin)
router.delete('/:id', taskController.deleteTask);

export default router;
