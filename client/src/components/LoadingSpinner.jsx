import React from 'react';
import { Loader } from 'lucide-react';

export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
      {message && <p className="mt-3 text-gray-600 text-sm">{message}</p>}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    </div>
  );
}
