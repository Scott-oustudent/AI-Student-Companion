
import React from 'react';
import { UsersIcon } from '../icons/Icons';

const CommunityHome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-surface rounded-lg shadow-lg animate-fade-in">
      <UsersIcon className="w-16 h-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">Student Community</h2>
      <p className="text-text_secondary max-w-md">
        This feature is coming soon! Get ready to connect with fellow students, join study groups, and share your academic journey.
      </p>
    </div>
  );
};

export default CommunityHome;
