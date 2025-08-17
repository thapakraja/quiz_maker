import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-surface rounded-lg shadow-xl">
      <div className="flex space-x-2" aria-label="Loading..." role="status">
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDuration: '1.2s' }}></div>
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}></div>
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}></div>
      </div>
      <p className="mt-6 text-xl font-semibold text-white">{message}</p>
      <p className="mt-2 text-on-surface">This may take a moment...</p>
    </div>
  );
};

export default Loader;