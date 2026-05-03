import React from 'react';

export function StatusBadge({ status, priority }) {
  if (priority) {
    const priorityConfig = {
      low: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Low' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`badge ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }

  const statusConfig = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`badge ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
