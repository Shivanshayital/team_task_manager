import React, { useEffect, useState } from 'react';
import { taskAPI, projectAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PageLoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import {
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
} from '../components/Form';
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  FileText,
  Loader,
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    projectId: '',
    deadline: '',
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { addToast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getUserTasks();
      setTasks(response.data.tasks);
    } catch (err) {
      addToast('Failed to load tasks', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getUserProjects();
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Failed to load projects');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      addToast('Task status updated', 'success');
      fetchTasks();
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to update task',
        'error'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.title.trim() || !formData.projectId) {
      addToast('Title and Project are required', 'error');
      setFormLoading(false);
      return;
    }

    try {
      if (editingId) {
        await taskAPI.updateTask(editingId, formData);
        addToast('Task updated successfully', 'success');
      } else {
        await taskAPI.createTask(formData);
        addToast('Task created successfully', 'success');
      }

      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        projectId: '',
        deadline: '',
      });
      setEditingId(null);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save task';
      addToast(message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      projectId: task.projectId._id,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(id);
      addToast('Task deleted successfully', 'success');
      fetchTasks();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      projectId: '',
      deadline: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      projectId: '',
      deadline: '',
    });
  };

  if (loading) return <PageLoadingSpinner />;

  // Filter tasks based on selected status
  let filteredTasks = tasks;
  if (filterStatus !== 'all') {
    filteredTasks = tasks.filter(t => t.status === filterStatus);
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const statusCounts = {
    pending: pendingTasks.length,
    'in-progress': inProgressTasks.length,
    completed: completedTasks.length,
  };

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
          </div>
          {user.role === 'admin' && (
            <button
              onClick={handleOpenModal}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterStatus === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className="ml-2 text-sm opacity-75">
                  ({statusCounts[option.value]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Kanban Board View (for all tasks) */}
        {filterStatus === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pending Column */}
            <div className="bg-gray-100 rounded-lg p-4 min-h-96">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <h3 className="font-semibold text-gray-900">
                  Pending ({pendingTasks.length})
                </h3>
              </div>
              <div className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No pending tasks
                  </p>
                ) : (
                  pendingTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task._id)}
                      onStatusChange={handleStatusChange}
                      userRole={user.role}
                      userId={user.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-blue-50 rounded-lg p-4 min-h-96 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-semibold text-gray-900">
                  In Progress ({inProgressTasks.length})
                </h3>
              </div>
              <div className="space-y-3">
                {inProgressTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No tasks in progress
                  </p>
                ) : (
                  inProgressTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task._id)}
                      onStatusChange={handleStatusChange}
                      userRole={user.role}
                      userId={user.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-green-50 rounded-lg p-4 min-h-96 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-semibold text-gray-900">
                  Completed ({completedTasks.length})
                </h3>
              </div>
              <div className="space-y-3">
                {completedTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No completed tasks
                  </p>
                ) : (
                  completedTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task._id)}
                      onStatusChange={handleStatusChange}
                      userRole={user.role}
                      userId={user.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filtered List View */}
        {filterStatus !== 'all' && (
          <Card>
            <CardHeader>
              <CardTitle>
                {statusOptions.find(o => o.value === filterStatus)?.label} Tasks
              </CardTitle>
              <CardDescription>
                {filteredTasks.length} task(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <EmptyState
                  type="tasks"
                  title={`No ${filterStatus} tasks`}
                  description="Create a new task to get started"
                  action={
                    user.role === 'admin'
                      ? {
                          label: 'Create Task',
                          onClick: handleOpenModal,
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task._id)}
                      onStatusChange={handleStatusChange}
                      userRole={user.role}
                      userId={user.id}
                      layout="list"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal Form */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingId ? 'Edit Task' : 'Create New Task'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="title" required>
                  Task Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  required
                  disabled={formLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="projectId" required>
                  Project
                </Label>
                <Select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={3}
                disabled={formLoading}
              />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormGroup>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={formLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={formLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={formLoading}
                />
              </FormGroup>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={formLoading}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

// Task Card Component
function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  userRole,
  userId,
  layout = 'card',
}) {
  return layout === 'card' ? (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {task.title}
        </h4>
        {userRole === 'admin' && (
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-indigo-600 rounded hover:bg-indigo-50"
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-2">{task.projectId?.name}</p>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-2">
        <StatusBadge priority={task.priority} />
        {task.deadline && (
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <select
        value={task.status}
        onChange={e => onStatusChange(task._id, e.target.value)}
        className="w-full text-xs py-1 px-2 border border-gray-200 rounded bg-white hover:border-indigo-300"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  ) : (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{task.projectId?.name}</p>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <StatusBadge status={task.status} />
                <StatusBadge priority={task.priority} />
                {task.deadline && (
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value)}
            className="text-sm py-2 px-3 border border-gray-200 rounded bg-white hover:border-indigo-300"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {userRole === 'admin' && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
