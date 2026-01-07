import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionDetail } from '../types';
import { ChevronDown, User, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuestionCardProps {
  question: QuestionDetail;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [expanded, setExpanded] = useState(false);
  const [showParentAnswer, setShowParentAnswer] = useState(false);

  let tagColorClass = '';
  switch (question.tag) {
    case 'Social':
      tagColorClass = 'bg-cyan-100 text-cyan-800';
      break;
    case 'Future':
      tagColorClass = 'bg-lime-100 text-lime-800';
      break;
    case 'Coping':
      tagColorClass = 'bg-orange-100 text-orange-800';
      break;
    case 'Discrepant':
      tagColorClass = 'bg-rose-100 text-rose-800';
      break;
    default:
      tagColorClass = 'bg-gray-100 text-gray-800';
  }

  let answerBgClass = '';
  let answerTextClass = '';

  const answerLower = question.childAnswer.toLowerCase();

  if (
    answerLower.includes('easy') ||
    answerLower.includes('not bother') ||
    answerLower.includes('never') ||
    answerLower.includes('excellent') ||
    answerLower.includes('very well')
  ) {
    answerBgClass = 'bg-emerald-50 border border-emerald-100';
    answerTextClass = 'text-emerald-700';
  } else if (
    answerLower.includes('hard') ||
    answerLower.includes('often') ||
    answerLower.includes('terrible')
  ) {
    answerBgClass = 'bg-rose-50 border border-rose-100';
    answerTextClass = 'text-rose-700';
  } else {
    answerBgClass = 'bg-blue-50 border border-blue-100';
    answerTextClass = 'text-blue-700';
  }

  const totalOptions = question.options.length;
  const childPct = ((question.childAnswerIndex + 1) / totalOptions) * 100;
  const parentPct = ((question.parentAnswerIndex + 1) / totalOptions) * 100;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 shadow-sm mb-4 relative transition-all duration-300',
        question.isDiscrepant && 'ring-1 ring-rose-200 border-l-4 border-l-rose-400'
      )}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Question {question.id}.</h3>
            {question.isDiscrepant && (
              <div className="group relative">
                <AlertCircle size={16} className="text-rose-400" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  Discrepancy Detected
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(tagColorClass, 'text-xs font-semibold px-2 py-1 rounded')}>
              {question.tag}
            </span>
            <ChevronDown
              size={20}
              className={cn(
                'text-gray-400 transition-transform duration-300',
                expanded && 'rotate-180'
              )}
            />
          </div>
        </div>

        <p className="text-gray-800 mb-4 font-medium leading-relaxed">
          {question.childText}
        </p>

        <div className={cn(answerBgClass, 'rounded-xl p-3 flex flex-col gap-2')}>
          <div className="flex justify-between items-center">
            <span className={cn('font-bold', answerTextClass)}>
              Answer: {question.childAnswer}
            </span>
            {!expanded && (
               <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowParentAnswer(!showParentAnswer);
                  }}
                  className="p-1 rounded-md hover:bg-black/5 text-gray-400 hover:text-gray-600 transition-colors"
                  title={showParentAnswer ? "Hide parent answer" : "Peek parent answer"}
               >
                  {showParentAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
               </button>
            )}
          </div>
          
          <AnimatePresence>
            {!expanded && showParentAnswer && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-black/5"
              >
                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
                  <Users size={12} />
                  <span>Parent's view: <strong>{question.parentAnswer}</strong></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Response Comparison
              </h4>

              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-full">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-gray-200 last:border-0 relative group"
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {question.options[i]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative py-1 space-y-4 px-1">
                    {/* Child Bar */}
                    <div className="relative z-10 group/child">
                      <div className="flex justify-between items-center text-xs mb-1 px-1">
                        <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                          <User size={14} className="fill-current" /> Child
                        </div>
                        <span className="text-blue-600 font-medium truncate ml-2 max-w-[60%]">
                          {question.childAnswer}
                        </span>
                      </div>
                      <div className="h-4 w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-[1px] cursor-help">
                        <motion.div
                          className="h-full bg-blue-500 rounded-full shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${childPct}%` }}
                          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/child:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl border border-white/10">
                        {question.childAnswer} - Option {question.childAnswerIndex + 1}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>

                    {/* Parent Bar */}
                    <div className="relative z-10 group/parent">
                      <div className="flex justify-between items-center text-xs mb-1 px-1">
                        <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                          <Users size={14} className="fill-current" /> Parent
                        </div>
                        <span className="text-purple-600 font-medium truncate ml-2 max-w-[60%]">
                          {question.parentAnswer}
                        </span>
                      </div>
                      <div className="h-4 w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-[1px] cursor-help">
                        <motion.div
                          className="h-full bg-purple-500 rounded-full shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${parentPct}%` }}
                          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/parent:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl border border-white/10">
                        {question.parentAnswer} - Option {question.parentAnswerIndex + 1}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
                  <span>{question.options[0]}</span>
                  <span>{question.options[question.options.length - 1]}</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                <span className="font-semibold text-gray-400 text-xs block mb-1">
                  PARENT QUESTION
                </span>
                "{question.parentText}"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
