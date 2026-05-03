import React, { useEffect, useState } from 'react';
import { projectAPI, authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PageLoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { FormGroup, Label, Input, Textarea } from '../components/Form';
import { Plus, Trash2, Edit, Users, Loader } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAllProjects();
      setProjects(response.data.projects);
    } catch (err) {
      addToast('Failed to load projects', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (!formData.name.trim()) {
        addToast('Project name is required', 'error');
        setFormLoading(false);
        return;
      }

      if (editingId) {
        await projectAPI.updateProject(editingId, formData);
        addToast('Project updated successfully', 'success');
      } else {
        await projectAPI.createProject(formData);
        addToast('Project created successfully', 'success');
      }

      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save project';
      addToast(message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({ name: project.name, description: project.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectAPI.deleteProject(id);
      addToast('Project deleted successfully', 'success');
      fetchProjects();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete project';
      addToast(message, 'error');
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) return <PageLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage and organize your projects</p>
          </div>
          {user.role === 'admin' && (
            <button
              onClick={handleOpenModal}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <EmptyState
            type="projects"
            title="No projects yet"
            description="Create your first project to get started with organizing your tasks."
            action={
              user.role === 'admin'
                ? {
                    label: 'Create Project',
                    onClick: handleOpenModal,
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card key={project._id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Owner: {project.owner?.name}
                    </p>
                  </div>
                  {user.role === 'admin' &&
                    project.owner?._id === user.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {project.members?.length || 0} team members
                  </span>
                </div>

                {project.members && project.members.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.members.slice(0, 3).map(member => (
                      <span
                        key={member._id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                      >
                        {member.name}
                      </span>
                    ))}
                    {project.members.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{project.members.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Modal Form */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingId ? 'Edit Project' : 'Create New Project'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormGroup>
              <Label htmlFor="name" required>
                Project Name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                disabled={formLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows={4}
                disabled={formLoading}
              />
            </FormGroup>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Project' : 'Create Project'}
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

export default Projects;
