import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { DiscrepantItem } from '../types';

interface DiscrepantResponsesProps {
  items: DiscrepantItem[];
  onItemClick: (id: string) => void;
}

export const DiscrepantResponses: React.FC<DiscrepantResponsesProps> = ({
  items,
  onItemClick,
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Discrepant responses</h2>
        <div className="group relative">
          <Info
            size={20}
            className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
          />
          <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-900/90 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl backdrop-blur-sm">
            These questions had significantly different answers between the child and
            parent. Tap a button to see the comparison.
            <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900/90"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 py-2">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors ${colorClasses[item.color] || colorClasses.blue}`}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
