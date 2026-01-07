
import React, { useState, useEffect, useRef } from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { ScoreCard } from './components/ScoreCard';
import { DiscrepantResponses } from './components/DiscrepantResponses';
import { QuestionCard } from './components/QuestionCard';
import { DiscrepancyPopup } from './components/DiscrepancyPopup';
import { ChatInterface } from './components/ChatInterface';
import { OmniLogo } from './components/OmniLogo';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import {
  PROFILE_DATA,
  HEALTH_SCORES,
  COPING_SCORES,
  SOCIAL_SCORES,
  DISCREPANT_ITEMS,
  QUESTIONS_DB,
  FILTER_OPTIONS,
} from './constants';
import { FilterType } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.ALL);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filteredQuestions = QUESTIONS_DB.filter((q) => {
    if (activeFilter === FilterType.ALL) return true;
    if (activeFilter === FilterType.DISCREPANT) return q.isDiscrepant;
    return q.tag === activeFilter;
  });

  const handleDiscrepancyClick = (idStr: string) => {
      const id = parseInt(idStr);
      const question = QUESTIONS_DB.find(q => q.id === id);
      if (question) {
          setSelectedDiscrepancyId(id);
      }
  };

  const selectedQuestion = QUESTIONS_DB.find(q => q.id === selectedDiscrepancyId);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pb-32 font-['Inter']">
      
      <AnimatePresence>
        {selectedQuestion && (
          <DiscrepancyPopup 
            question={selectedQuestion} 
            onClose={() => setSelectedDiscrepancyId(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="w-full max-w-md bg-gray-50 min-h-screen relative flex flex-col shadow-2xl">
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
          <ProfileHeader profile={PROFILE_DATA} />

          <ScoreCard category={HEALTH_SCORES} />
          <ScoreCard category={COPING_SCORES} />
          <ScoreCard category={SOCIAL_SCORES} />

          <DiscrepantResponses items={DISCREPANT_ITEMS} onItemClick={handleDiscrepancyClick} />

          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-xl font-bold text-gray-900">Question Responses</h2>
            
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700"
              >
                Filter: {activeFilter}
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setActiveFilter(option);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors",
                          activeFilter === option ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <div className="bg-gray-200 rounded-full p-4 mb-3 text-gray-400">
                    <ChevronDown size={24} />
                </div>
                <p className="text-gray-500 font-medium">No questions found</p>
                <p className="text-gray-400 text-sm">Try changing the filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Slick Floating Action Button for Omni Assistant with Flowing Gradient */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-6 flex justify-center">
          <motion.button
            onClick={() => setIsChatOpen(true)}
            className="group relative flex items-center gap-4 bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950 bg-[length:200%_200%] animate-gradient-slow text-white pl-4 pr-8 py-4 rounded-[28px] font-bold shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/50 transition-all border border-white/10 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              y: { type: 'spring', damping: 15 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Shimmer Effect Overlay */}
            <motion.div 
              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            />

            {/* Shared Logo Instance (Scaled down for button) */}
            <div className="relative z-10">
              <OmniLogo size="sm" />
            </div>

            <div className="relative z-10 flex flex-col items-start">
              <span className="text-[14px] tracking-tight text-zinc-100 font-black leading-tight">Ask Omni Assistant</span>
              <div className="flex items-center gap-1.5 opacity-60">
                <Sparkles size={10} className="text-indigo-400" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black">Powered by Gemini</span>
              </div>
            </div>

            {/* Glow Aura */}
            <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default App;