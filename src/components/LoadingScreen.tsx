import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div >
          <img src="/logo.png" alt="VidStore" className="w-[30vw]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 