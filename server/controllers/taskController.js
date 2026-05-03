import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const normalizeOptionalObjectId = (value) => (value === '' ? null : value);
const normalizeOptionalDate = (value) => (value === '' ? null : value);

// Create task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, priority } = req.body;
    const assignedTo = normalizeOptionalObjectId(req.body.assignedTo);
    const deadline = normalizeOptionalDate(req.body.deadline);

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and Project ID are required' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee || assignee.role !== 'member') {
        return res.status(400).json({ message: 'Task can only be assigned to a valid member' });
      }
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
      deadline,
      priority,
      createdBy: req.user.id,
      status: 'pending'
    });

    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'projectId']);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user tasks
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ]
    })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get project tasks
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const assignedTo = normalizeOptionalObjectId(req.body.assignedTo);
    const deadline = normalizeOptionalDate(req.body.deadline);
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization - creator or admin or assigned user can update
    if (
      task.createdBy.toString() !== req.user.id &&
      task.assignedTo?.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (assignedTo !== undefined) {
      if (assignedTo) {
        const assignee = await User.findById(assignedTo);
        if (!assignee || assignee.role !== 'member') {
          return res.status(400).json({ message: 'Task can only be assigned to a valid member' });
        }
      }
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (deadline !== undefined) task.deadline = deadline;
    if (priority) task.priority = priority;

    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'projectId']);

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (
      task.createdBy.toString() !== req.user.id &&
      task.assignedTo?.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'projectId']);

    res.status(200).json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task (Creator or Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
