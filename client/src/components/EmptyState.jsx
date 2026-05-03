import React from 'react';
import { Package, FileText, CheckSquare } from 'lucide-react';

const emptyStateIcons = {
  projects: <Package className="w-12 h-12" />,
  tasks: <CheckSquare className="w-12 h-12" />,
  default: <FileText className="w-12 h-12" />,
};

export function EmptyState({ 
  type = 'default', 
  title = 'No items found', 
  description = 'Get started by creating your first item.',
  action,
}) {
  const icon = emptyStateIcons[type] || emptyStateIcons.default;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
