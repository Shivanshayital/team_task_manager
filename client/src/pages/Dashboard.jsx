import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, projectAPI, taskAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PageLoadingSpinner } from '../components/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  FolderOpen,
  ArrowRight,
  Users,
} from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { addToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const requests = [
        user.role === 'admin' ? projectAPI.getAllProjects() : projectAPI.getUserProjects(),
        user.role === 'admin' ? taskAPI.getAllTasks() : taskAPI.getUserTasks(),
      ];

      if (user.role === 'admin') {
        requests.push(authAPI.getAllUsers());
      }

      const [projectsRes, tasksRes, usersRes] = await Promise.all(requests);

      setProjects(projectsRes.data.projects);
      setTasks(tasksRes.data.tasks);
      if (user.role === 'admin') {
        setMembers(usersRes.data.users.filter(member => member.role === 'member'));
      }

      // Calculate stats
      const totalTasks = tasksRes.data.tasks.length;
      const pending = tasksRes.data.tasks.filter(t => t.status === 'pending').length;
      const inProgress = tasksRes.data.tasks.filter(
        t => t.status === 'in-progress'
      ).length;
      const completed = tasksRes.data.tasks.filter(t => t.status === 'completed').length;
      const overdue = tasksRes.data.tasks.filter(
        t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed'
      ).length;

      setStats({ total: totalTasks, pending, inProgress, completed, overdue });
    } catch (err) {
      addToast('Failed to load dashboard data', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overdueTasks = tasks
    .filter(
      t =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== 'completed'
    )
    .slice(0, 5);

  const recentTasks = tasks.slice(0, 5);
  const recentProjects = projects.slice(0, 6);
  const memberTaskSummary = members
    .map((member) => {
      const assignedTasks = tasks.filter(task => task.assignedTo?._id === member._id);
      const completedTasks = assignedTasks.filter(task => task.status === 'completed').length;

      return {
        ...member,
        assignedCount: assignedTasks.length,
        completedCount: completedTasks,
        activeCount: assignedTasks.length - completedTasks,
      };
    })
    .sort((a, b) => b.assignedCount - a.assignedCount);
  const assignedMemberCount = memberTaskSummary.filter(member => member.assignedCount > 0).length;
  const unassignedTasksCount = tasks.filter(task => !task.assignedTo).length;

  if (loading) return <PageLoadingSpinner />;

  const statCards = [
    {
      icon: CheckCircle2,
      label: 'Total Tasks',
      value: stats.total,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      icon: Zap,
      label: 'In Progress',
      value: stats.inProgress,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats.completed,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      value: stats.overdue,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  if (user.role === 'admin') {
    statCards.push(
      {
        icon: Users,
        label: 'Members With Tasks',
        value: assignedMemberCount,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
      },
      {
        icon: FolderOpen,
        label: 'Unassigned',
        value: unassignedTasksCount,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your tasks and projects
          </p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${user.role === 'admin' ? 'lg:grid-cols-7' : 'lg:grid-cols-5'} gap-4 mb-8`}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.bg} border-0`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg bg-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <CardTitle>Overdue Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <div
                    key={task._id}
                    className="flex items-start justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">
                        {task.projectId?.name}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>
                      Your latest {recentTasks.length} tasks
                    </CardDescription>
                  </div>
                  <Link
                    to="/tasks"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <EmptyState
                    type="tasks"
                    title="No tasks yet"
                    description="Create your first task to get started"
                    action={{
                      label: 'Create Task',
                      onClick: () => (window.location.href = '/tasks'),
                    }}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Task
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Project
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTasks.map(task => (
                          <tr
                            key={task._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {task.title}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {task.projectId?.name || 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={task.status} />
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString()
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {user.role === 'admin' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Member Workload</CardTitle>
                      <CardDescription>
                        How tasks are distributed across your members
                      </CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">
                      {assignedMemberCount} of {members.length} members assigned
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {memberTaskSummary.length === 0 ? (
                    <EmptyState
                      type="tasks"
                      title="No members yet"
                      description="Members who sign up will appear here for assignment tracking."
                    />
                  ) : (
                    <div className="space-y-3">
                      {memberTaskSummary.map(member => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {member.assignedCount} task{member.assignedCount === 1 ? '' : 's'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.activeCount} active, {member.completedCount} completed
                              </p>
                            </div>
                            <StatusBadge
                              status={
                                member.assignedCount === 0
                                  ? 'pending'
                                  : member.activeCount > 0
                                    ? 'in-progress'
                                    : 'completed'
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Your Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>
                      {recentProjects.length} active projects
                    </CardDescription>
                  </div>
                  <Link
                    to="/projects"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentProjects.length === 0 ? (
                  <EmptyState
                    type="projects"
                    title="No projects"
                    description="Create your first project to get started"
                    action={{
                      label: 'Create Project',
                      onClick: () => (window.location.href = '/projects'),
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    {recentProjects.map(project => (
                      <div
                        key={project._id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <FolderOpen className="w-5 h-5 text-indigo-600" />
                          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {project.members?.length || 0} members
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {project.description || 'No description'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to="/tasks"
                  className="block w-full btn btn-primary text-center"
                >
                  Create New Task
                </Link>
                <Link
                  to="/projects"
                  className="block w-full btn btn-secondary text-center"
                >
                  Create New Project
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
