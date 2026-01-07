import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryScore, ScoreMetric } from '../types';
import { ChevronDown, BarChart2, HelpCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScoreCardProps {
  category: CategoryScore;
}

type FilterType = 'all' | 'child' | 'parent' | 'diff';

const MetricBox: React.FC<{ metric: ScoreMetric }> = ({ metric }) => {
  let bgClass = '';
  let textClass = '';
  let subTextClass = '';
  let tooltipText = '';

  switch (metric.type) {
    case 'score':
      bgClass = 'bg-blue-100';
      textClass = 'text-blue-700';
      subTextClass = 'text-blue-600';
      tooltipText = "This score is based on the answers given by the child.";
      break;
    case 'parent':
      bgClass = 'bg-purple-100';
      textClass = 'text-purple-800';
      subTextClass = 'text-purple-700';
      tooltipText = "This score is based on the answers given by the parent.";
      break;
    case 'diff':
      const val = parseFloat(metric.value.toString());
      tooltipText = "This shows the difference between the child's score and the parent's score.";
      if (val < 0) {
        bgClass = 'bg-red-100';
        textClass = 'text-red-800';
        subTextClass = 'text-red-700';
        tooltipText += " The child's score is lower.";
      } else if (val > 0) {
         bgClass = 'bg-green-100';
         textClass = 'text-green-800';
         subTextClass = 'text-green-700';
         tooltipText += " The child's score is higher.";
      } else {
        bgClass = 'bg-gray-100';
        textClass = 'text-gray-800';
        subTextClass = 'text-gray-600';
        tooltipText += " The scores are the same.";
      }
      break;
  }

  return (
    <motion.div
      className={cn(
        'group relative flex-1 rounded-lg py-3 px-2 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md cursor-help',
        bgClass
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className={cn('text-xl font-bold', textClass)}>{metric.value}</span>
      <span
        className={cn(
          'text-xs font-medium mt-1 border-b border-dotted border-current',
          subTextClass
        )}
      >
        {metric.label}
      </span>

      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl py-2 px-3 text-center shadow-xl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2 leading-snug">
        {tooltipText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
      </div>
    </motion.div>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  
  const scoreMetric = category.metrics.find(m => m.type === 'score');
  const parentMetric = category.metrics.find(m => m.type === 'parent');
  const diffMetric = category.metrics.find(m => m.type === 'diff');
  
  const childVal = scoreMetric ? parseFloat(scoreMetric.value.toString()) : 0;
  const parentVal = parentMetric ? parseFloat(parentMetric.value.toString()) : 0;
  const diffVal = diffMetric ? parseFloat(diffMetric.value.toString()) : 0;
  
  const maxVal = Math.max(childVal, parentVal, 100);

  const getInterpretation = (diff: number) => {
    if (diff <= -5) return "The child reports a lower quality of life than the parent perceives. This may suggest internal distress not visible to the caregiver.";
    if (diff >= 5) return "The child reports a higher quality of life than the parent perceives. The caregiver may be more concerned about this area than the child is.";
    return "The child and parent perceptions are well-aligned, suggesting a shared understanding of this aspect of well-being.";
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{category.title}</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'p-2 rounded-full transition-all duration-300',
            expanded ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
          )}
        >
          {expanded ? (
            <ChevronDown size={20} className="transform rotate-180" />
          ) : (
            <BarChart2 size={20} />
          )}
        </button>
      </div>

      <div className="flex gap-3 mb-3">
        {category.metrics.map((metric, idx) => (
          <MetricBox key={idx} metric={metric} />
        ))}
      </div>

      <div className="flex items-center mb-1">
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
        >
          <HelpCircle size={14} />
          {showExplanation ? 'Hide Explanation' : 'Explain Score'}
        </button>
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-2"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-blue-100 mt-2 shadow-inner">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-500 mt-0.5" />
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-blue-200/50">
                    <div>
                      <span className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider">Child Score ({childVal})</span>
                      <p className="text-[11px] text-blue-900/70 leading-tight mt-1">Reflects how the child views their own situation.</p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-purple-700 uppercase tracking-wider">Parent Score ({parentVal})</span>
                      <p className="text-[11px] text-purple-900/70 leading-tight mt-1">Reflects the caregiver's observations.</p>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Interpretation</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed italic">
                      {getInterpretation(diffVal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Comparison Analysis
                  </h4>
                  <div className="flex gap-1 bg-gray-200 p-0.5 rounded-lg">
                    {(['all', 'child', 'parent', 'diff'] as FilterType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-2 py-1 text-[10px] font-bold rounded-md transition-all",
                          filter === f ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Child Bar */}
                {(filter === 'all' || filter === 'child') && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-3"
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-blue-700">Child</span>
                      <span className="font-bold text-gray-700">{childVal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(childVal / maxVal) * 100}%` }}
                        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Parent Bar */}
                {(filter === 'all' || filter === 'parent') && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-purple-700">Parent</span>
                      <span className="font-bold text-gray-700">{parentVal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-purple-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(parentVal / maxVal) * 100}%` }}
                        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Difference Visualization */}
                {filter === 'diff' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-600">Score Difference</span>
                      <span className={cn("font-bold", diffVal < 0 ? "text-red-500" : diffVal > 0 ? "text-green-500" : "text-gray-500")}>
                        {diffVal > 0 ? `+${diffVal}` : diffVal}
                      </span>
                    </div>
                    <div className="relative h-6 bg-gray-200 rounded-lg flex items-center px-0.5">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 z-10"></div>
                      <motion.div 
                        className={cn("h-4 rounded-sm", diffVal < 0 ? "bg-red-400" : "bg-green-400")}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.abs(diffVal)}%`,
                          marginLeft: diffVal < 0 ? `${50 - Math.abs(diffVal)}%` : '50%'
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-400 px-1 font-mono">
                      <span>-100</span>
                      <span>0</span>
                      <span>+100</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
