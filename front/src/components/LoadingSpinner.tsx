import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Processing your video..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin transition-colors duration-200" />
      <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-200">
        {message}
      </p>
    </div>
  );
};
