import React from 'react';
import { motion } from 'framer-motion';
import { Profile } from '../types';
import { ChevronLeft } from 'lucide-react';

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 relative flex flex-col items-center text-center">
      <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
        <ChevronLeft size={24} />
      </button>

      <motion.div
        className="mb-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md mx-auto"
        />
      </motion.div>

      <h1 className="text-xl font-bold text-gray-900 leading-tight">
        {profile.name}{' '}
        <span className="text-gray-500 font-medium">({profile.role})</span>
      </h1>

      <div className="mt-1 text-sm text-gray-500 space-y-0.5">
        <p>Relationship: {profile.relationship}</p>
        <p>Submission Date: {profile.submissionDate}</p>
      </div>

      <motion.div
        className="mt-4"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronLeft size={20} className="text-gray-800 rotate-270 transform -rotate-90" />
      </motion.div>
    </div>
  );
};
