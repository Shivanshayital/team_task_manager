import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
};

// Project endpoints
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getAllProjects: () => api.get('/projects'),
  getUserProjects: () => api.get('/projects/my-projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, data) => api.delete(`/projects/${id}/members`, { data }),
};

// Task endpoints
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getAllTasks: () => api.get('/tasks'),
  getUserTasks: () => api.get('/tasks/my-tasks'),
  getProjectTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  getTask: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskStats: (projectId) => api.get(`/tasks/stats/${projectId}`),
};

export default api;
