import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionDetail } from '../types';
import { User, Users, X } from 'lucide-react';

interface DiscrepancyPopupProps {
  question: QuestionDetail;
  onClose: () => void;
}

export const DiscrepancyPopup: React.FC<DiscrepancyPopupProps> = ({ question, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-1">Discrepancy Detected</span>
            <h3 className="text-xl font-bold text-gray-900">Question {question.id}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          <div className="mb-6 relative pl-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-2">
               <User size={16} className="text-blue-600" />
               <h4 className="font-semibold text-blue-900">Child's Perspective</h4>
            </div>
            <p className="text-gray-700 mb-2 italic text-sm leading-relaxed">"{question.childText}"</p>
            <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl font-bold border border-blue-100 shadow-sm">
              {question.childAnswer}
            </div>
          </div>

          <div className="mb-8 relative pl-4 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-2">
               <Users size={16} className="text-purple-600" />
               <h4 className="font-semibold text-purple-900">Parent's Perspective</h4>
            </div>
             <p className="text-gray-700 mb-2 italic text-sm leading-relaxed">"{question.parentText}"</p>
            <div className="bg-purple-50 text-purple-800 px-4 py-3 rounded-xl font-bold border border-purple-100 shadow-sm">
              {question.parentAnswer}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center tracking-wider">Response Spectrum</h4>
             <div className="relative pt-6 pb-2">
                <div className="h-2 bg-gray-200 rounded-full w-full relative">
                   <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
                      {[0,1,2,3,4].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      ))}
                   </div>
                   
                   <motion.div
                     className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center z-20"
                     style={{
                       left: `${(question.childAnswerIndex / 4) * 100}%`,
                       transform: 'translate(-50%, -50%)',
                     }}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                   >
                     <User size={14} className="text-white" />
                     <span className="absolute -top-8 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-md">
                       Child
                     </span>
                   </motion.div>

                   <motion.div
                     className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center z-20"
                     style={{
                       left: `${(question.parentAnswerIndex / 4) * 100}%`,
                       transform: 'translate(-50%, -50%)',
                     }}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                   >
                     <Users size={14} className="text-white" />
                     <span className="absolute -bottom-8 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-md">
                       Parent
                     </span>
                   </motion.div>
                </div>
                
                <div className="flex justify-between mt-10 text-[10px] text-gray-400 font-medium">
                   <span>{question.options[0]}</span>
                   <span>{question.options[4]}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};
