import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { 
  X, Send, Sparkles, Bot, User, ThumbsUp, ThumbsDown, 
  AlertCircle, TrendingUp, Info, CheckCircle2, ArrowRight, 
  ShieldAlert, Zap, MessageSquare, ChevronRight, BarChart3, 
  LineChart as LineIcon, History, Smile, Meh, Frown, Heart,
  Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell, 
  Area, 
  AreaChart 
} from 'recharts';
import { cn } from '../lib/utils';
import { OmniLogo } from './OmniLogo';
import {
  PROFILE_DATA,
  HEALTH_SCORES,
  COPING_SCORES,
  SOCIAL_SCORES,
  QUESTIONS_DB,
  HISTORICAL_TRENDS
} from '../constants';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

type SentimentType = 'positive' | 'neutral' | 'negative';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sentiment?: SentimentType;
  feedback?: 'up' | 'down';
}

const STORAGE_KEY = 'omni_chat_history';

const DEFAULT_WELCOME_MESSAGE: Message = { 
  id: 'welcome', 
  role: 'model', 
  text: `Safety Notice: This information is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. --- Hello! I'm **Omni**. I've reviewed ${PROFILE_DATA.name}'s assessment history. \n\nI can visualize score trends for **Future Health**, **Coping & Adjustment**, and **Social-Emotional** well-being. How can I assist you today?`, 
  sentiment: 'positive' 
};

const SUGGESTIONS = [
  "Show Future Health trend",
  "Show Coping & Adjustment trend",
  "Show Social-Emotional trend",
  "Analyze Jane's score gaps",
  "How to improve Jane's scores?"
];

/**
 * Enhanced Sentiment Heuristic
 */
const determineSentiment = (text: string): SentimentType => {
  const content = text.toLowerCase();
  const positiveWords = ['good', 'great', 'better', 'improving', 'aligned', 'healthy', 'easy', 'never', 'excellent', 'love', 'like', 'happy', 'positive', 'strength', 'progress'];
  const negativeWords = ['worried', 'scared', 'bad', 'worse', 'discrepancy', 'hard', 'bother', 'often', 'terrible', 'dislike', 'pain', 'infection', 'concern', 'anxiety', 'struggle', 'low', 'decline'];

  const posCount = positiveWords.filter(word => content.includes(word)).length;
  const negCount = negativeWords.filter(word => content.includes(word)).length;

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
};

const SentimentIndicator = ({ sentiment }: { sentiment?: SentimentType }) => {
  if (!sentiment) return null;

  const config = {
    positive: { icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Positive Tone' },
    neutral: { icon: Meh, color: 'text-zinc-400', bg: 'bg-zinc-100', label: 'Neutral Tone' },
    negative: { icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Concern Detected' },
  }[sentiment];

  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/20 shadow-sm", config.bg)}>
      <Icon size={12} className={config.color} />
      <span className={cn("text-[9px] font-black uppercase tracking-wider", config.color)}>{config.label}</span>
    </div>
  );
};

/**
 * High-impact Data Visualization Component
 */
const VizChart = React.memo<{ data: any }>(({ data }) => {
  const { type, title, data: chartData } = data;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="my-6 p-6 bg-white rounded-[32px] border border-zinc-200 shadow-xl overflow-hidden group"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            {type === 'line' ? <History size={18} /> : <BarChart3 size={18} />}
          </div>
          <h5 className="text-sm font-black text-zinc-900 uppercase tracking-tight">{title}</h5>
        </div>
        <div className="px-2 py-1 rounded-full bg-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {type === 'line' ? 'Trend Tracking' : 'Snapshot'}
        </div>
      </div>

      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorParent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.05}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} 
                domain={[0, 100]} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }}
              />
              <Area 
                type="monotone" 
                name="Child"
                dataKey="child" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500} 
              />
              <Area 
                type="monotone" 
                name="Parent"
                dataKey="parent" 
                stroke="#18181b" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                fillOpacity={1}
                fill="url(#colorParent)"
                animationDuration={2000} 
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#f4f4f5', radius: 8 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#18181b'} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {type === 'line' && (
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Child Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-zinc-950" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Parent Score</span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

/**
 * Interactive Comparison Bar Chart
 */
const MiniScoreChart = React.memo<{ label: string; child: number; parent: number }>(({ label, child, parent }) => {
  const [showInsight, setShowInsight] = useState(false);
  const gap = Math.abs(child - parent).toFixed(1);
  const isAligned = parseFloat(gap) < 5;
  const childW = Math.min(100, Math.max(5, child));
  const parentW = Math.min(100, Math.max(5, parent));
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="my-6 bg-white rounded-[28px] border border-zinc-200 shadow-lg overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">{label} Matrix</span>
            <h5 className="text-sm font-bold text-zinc-900">Perception Gap</h5>
          </div>
          <div className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-sm border transition-all",
            isAligned ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-950 text-white border-zinc-800"
          )}>
            {isAligned ? <CheckCircle2 size={12} /> : <TrendingUp size={12} />}
            {isAligned ? "ALIGNED" : `${gap} PT GAP`}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-[11px] mb-2 px-0.5">
              <span className="text-blue-600 font-bold flex items-center gap-1.5"><User size={12} /> Child Result</span>
              <span className="text-zinc-900 font-black">{child}</span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${childW}%` }}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-2 px-0.5">
              <span className="text-zinc-500 font-bold flex items-center gap-1.5"><Bot size={12} /> Caregiver View</span>
              <span className="text-zinc-900 font-black">{parent}</span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${parentW}%` }}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
                className="h-full bg-zinc-800 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100">
          <button 
            onClick={() => setShowInsight(!showInsight)}
            className="flex items-center justify-between w-full text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            <span className="flex items-center gap-2"><Info size={12} /> Clinical Context</span>
            <ChevronRight size={14} className={cn("transition-transform", showInsight && "rotate-90")} />
          </button>
          <AnimatePresence>
            {showInsight && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-[11px] text-zinc-600 font-medium leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100 mt-3">
                  {isAligned 
                    ? "Observations are perfectly synchronized, indicating a high level of empathy and daily awareness between parent and child." 
                    : `The discrepancy of ${gap} points indicates that ${PROFILE_DATA.name} may be experiencing internal emotional nuances that aren't yet visible through surface-level observations.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Impactful Insight Highlight Component
 */
const ImpactHighlight = React.memo<{ text: string }>(({ text }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="my-5 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl flex gap-4 items-center relative overflow-hidden group shadow-sm"
  >
    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-125 transition-transform duration-700">
      <Zap size={64} className="text-emerald-500" />
    </div>
    <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-lg relative z-10">
      <Zap size={20} className="text-indigo-400 animate-pulse" />
    </div>
    <div className="relative z-10">
      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-1">Omni Intelligence Highlight</span>
      <p className="text-[14px] font-bold text-emerald-900 leading-snug italic">"{text}"</p>
    </div>
  </motion.div>
));

/**
 * Enhanced Message Parsing Component
 */
const MessageContent = React.memo<{ text: string; role: string }>(({ text, role }) => {
  const { disclaimer, mainContent } = useMemo(() => {
    const parts = text.split('---');
    return {
      disclaimer: parts.length > 1 ? parts[0] : null,
      mainContent: parts.length > 1 ? parts.slice(1).join('---') : text
    };
  }, [text]);

  const sanitize = (s: string) => s.replace(/\*\*/g, '').replace(/\*/g, '').trim();

  const parseBlocks = useCallback((content: string) => {
    const triggerRegex = /(\{score:\s*[^,]+?,\s*[\d.]+\s*,\s*[\d.]+\s*\}|\{viz:\s*\{.*?\}\}|\{insight:\s*.*?\}|\n)/gis;
    const tokens = content.split(triggerRegex);

    return tokens.map((token, i) => {
      const trimmed = token.trim();
      if (!trimmed && token !== '\n') return null;
      if (token === '\n') return <div key={i} className="h-2" />;

      const scoreMatch = trimmed.match(/\{score:\s*([^,]+?),\s*([\d.]+)\s*,\s*([\d.]+)\s*\}/i);
      if (scoreMatch) {
        return <MiniScoreChart key={i} label={scoreMatch[1]} child={parseFloat(scoreMatch[2])} parent={parseFloat(scoreMatch[3])} />;
      }

      const vizMatch = trimmed.match(/\{viz:\s*(\{.*?\}s*)\}/i);
      if (vizMatch) {
        try {
          const data = JSON.parse(vizMatch[1]);
          return <VizChart key={i} data={data} />;
        } catch (e) { return null; }
      }

      const insightMatch = trimmed.match(/\{insight:\s*(.*?)\}/i);
      if (insightMatch) {
        return <ImpactHighlight key={i} text={sanitize(insightMatch[1])} />;
      }

      const isHeader = trimmed.startsWith('###') || (trimmed.startsWith('**') && trimmed.endsWith('**'));
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ');
      
      const textBaseClass = role === 'user' ? 'text-white' : 'text-zinc-700';

      if (isHeader) {
        return (
          <h4 key={i} className={cn("text-base font-black mt-6 mb-3 flex items-center gap-3 leading-tight", role === 'user' ? 'text-white' : 'text-zinc-900')}>
            <div className={cn("w-1.5 h-6 rounded-full", role === 'user' ? 'bg-white/30' : 'bg-indigo-500')} />
            {sanitize(trimmed.replace('###', ''))}
          </h4>
        );
      }

      if (isBullet) {
        return (
          <div key={i} className="flex gap-3 mb-2 items-start group">
            <div className={cn("mt-1.5 min-w-[18px] h-[18px] rounded-lg flex items-center justify-center transition-all", role === 'user' ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white')}>
              <ArrowRight size={10} className="group-hover:translate-x-0.5" />
            </div>
            <p className={cn("text-[14px] leading-relaxed font-semibold pt-0.5", textBaseClass)}>
              {sanitize(trimmed.replace('•', '').replace('-', ''))}
            </p>
          </div>
        );
      }

      return <p key={i} className={cn("text-[14px] leading-[1.65] mb-3 last:mb-0 font-medium", textBaseClass)}>{sanitize(token)}</p>;
    });
  }, [role]);

  return (
    <div className="space-y-4">
      {role === 'model' && disclaimer && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-50 border border-zinc-200 p-5 rounded-[24px] flex gap-4 shadow-sm mb-6 relative group overflow-hidden">
          <div className="bg-zinc-950 p-2.5 rounded-xl text-white shadow-md relative z-10 shrink-0"><AlertCircle size={20} className="text-indigo-400" /></div>
          <div className="relative z-10">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Safety Notice</span>
            <p className="text-[11px] leading-relaxed text-zinc-900 font-black italic">{sanitize(disclaimer)}</p>
          </div>
          <div className="absolute top-0 right-0 p-1 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><ShieldAlert size={56} /></div>
        </motion.div>
      )}
      <div className="main-content-flow">{parseBlocks(mainContent)}</div>
    </div>
  );
});

/**
 * Individual Message Entry Component
 */
const MessageItem = React.memo<{ msg: Message; isLast: boolean }>(({ msg, isLast }) => {
  return (
    <motion.div
      className={cn('flex gap-4 items-start', msg.role === 'user' && 'flex-row-reverse')}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    >
      <div className={cn(
        'w-11 h-11 rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg transition-all',
        msg.role === 'user' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900 border border-zinc-100'
      )}>
        {msg.role === 'user' ? <User size={20} /> : <div className="p-2"><Zap size={18} className="text-indigo-500" /></div>}
      </div>
      <div className={cn('max-w-[85%] flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}>
        <div className={cn(
          'p-6 rounded-[24px] shadow-sm break-words relative overflow-visible',
          msg.role === 'user' ? 'bg-zinc-950 text-white rounded-tr-none font-bold' : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
        )}>
          {/* Sentiment Indicator positioned relative to the bubble */}
          <div className={cn("absolute -top-3 flex", msg.role === 'user' ? 'right-4' : 'left-4')}>
            <SentimentIndicator sentiment={msg.sentiment} />
          </div>
          
          <MessageContent text={msg.text} role={msg.role} />
        </div>
        {msg.role === 'model' && msg.text.length > 0 && (
          <div className="flex items-center gap-5 mt-4 ml-4 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-zinc-100 rounded-lg active:scale-90 transition-all"><ThumbsUp size={14} /></button>
              <button className="p-2 hover:bg-zinc-100 rounded-lg active:scale-90 transition-all"><ThumbsDown size={14} /></button>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-indigo-500" /> Response Validated
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  // Initialize state from localStorage if available, otherwise use default welcome
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage', e);
    }
  }, [messages]);

  useEffect(() => { if (isOpen) scrollToBottom(isLoading ? "smooth" : "auto"); }, [isOpen, messages.length, isLoading, scrollToBottom]);

  useEffect(() => {
    const initChat = async () => {
      try {
        /* Initialize with API key from environment variable directly as per guidelines */
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const contextData = { 
          profile: PROFILE_DATA, 
          scores: { health: HEALTH_SCORES, coping: COPING_SCORES, social: SOCIAL_SCORES }, 
          questions: QUESTIONS_DB,
          historical_trends: HISTORICAL_TRENDS
        };
        const systemInstruction = `
          ACT AS: Omni, a Supportive Pediatric Intelligence Assistant.
          STYLE: Sleek, smart, empathetic. 
          
          VISUALIZATION RULES:
          1. COMPARISON (Current Snapshot): {score: Category Name, Child Score, Parent Score}.
          2. TRENDS (Historical Data Analysis): WHENEVER the user asks for trends, progress, or "over time" analysis for ANY category (Future Health, Coping, or Social), YOU MUST use: 
             {viz: {"type": "line", "title": "Historical Progress: Category Name", "data": [{"label": "Date", "child": X, "parent": Y}]}}.
             Use the historical_trends context provided to populate this.
          3. SNAPSHOT BARS: For single point multi-category comparison, use: {viz: {"type": "bar", "title": "...", "data": [{"label": "Category", "value": X}]}}.
          4. HIGHLIGHTS: Use {insight: text} for critical findings.
          
          FORMAT: Start EVERY response with medical disclaimer then "---". 
          CONTEXT: ${JSON.stringify(contextData)}
          HISTORY: Use the previous conversation history if relevant to provide continuity.
        `;

        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: { systemInstruction, temperature: 0.65 },
        });
      } catch (e) { console.error('Failed to initialize chat:', e); }
    };
    initChat();
  }, []);

  const handleSend = useCallback(async (msgToType?: string) => {
    const text = (msgToType || inputValue).trim();
    if (!text || isLoading || !chatSessionRef.current) return;
    
    const userSentiment = determineSentiment(text);
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', text, sentiment: userSentiment }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: text });
      const modelId = `model-${Date.now()}`;
      let full = "";
      setMessages(prev => [...prev, { id: modelId, role: 'model', text: "", sentiment: 'neutral' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          full += c.text;
          const currentModelSentiment = determineSentiment(full);
          setMessages(prev => prev.map(m => m.id === modelId ? { ...m, text: full, sentiment: currentModelSentiment } : m));
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'model', text: "Service temporarily unavailable.", sentiment: 'negative' }]);
    } finally { setIsLoading(false); }
  }, [inputValue, isLoading]);

  const clearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([DEFAULT_WELCOME_MESSAGE]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-x-0 bottom-0 z-[60] h-[92vh] bg-white rounded-t-[48px] shadow-2xl flex flex-col overflow-hidden"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        >
          <div className="w-full flex justify-center pt-5 pb-2 shrink-0 relative">
            <div className="w-16 h-1.5 bg-zinc-200 rounded-full" />
          </div>
          <div className="px-8 pb-6 border-b border-zinc-100 flex justify-between items-center bg-white z-10 shrink-0">
            <div className="flex items-center gap-6"><OmniLogo /><h3 className="font-black text-zinc-950 text-2xl tracking-tighter">Omni Assistant</h3></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearHistory} 
                className="p-3 rounded-2xl text-zinc-300 hover:text-rose-500 transition-all flex items-center gap-2"
                title="Clear History"
              >
                <Trash2 size={20} />
              </button>
              <button onClick={onClose} className="p-3 rounded-2xl text-zinc-300 hover:text-zinc-950 transition-all"><X size={28} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 bg-zinc-50/50 no-scrollbar">
            {messages.map((msg, idx) => <MessageItem key={msg.id} msg={msg} isLast={idx === messages.length - 1} />)}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-[20px] bg-zinc-950 text-white flex items-center justify-center shadow-lg"><Zap size={22} className="text-indigo-400 animate-pulse" /></div>
                <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-zinc-100 flex gap-2.5 items-center">
                  {[0, 0.15, 0.3].map(d => <motion.div key={d} animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.9, delay: d }} className="w-2.5 h-2.5 bg-zinc-400 rounded-full" />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          <div className="bg-white border-t border-zinc-100 pb-12 shrink-0 px-8">
            <div className="py-4 flex gap-3 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s, i) => <button key={i} onClick={() => handleSend(s)} className="shrink-0 px-5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-[13px] font-black text-zinc-600 hover:text-zinc-950 transition-all whitespace-nowrap">{s}</button>)}
            </div>
            <div className="relative flex items-center bg-zinc-100/50 border-2 border-zinc-200/50 rounded-[30px] p-2 focus-within:border-zinc-950 transition-all">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask Omni anything..." className="flex-1 bg-transparent border-none focus:outline-none px-6 py-4 text-[17px] font-bold" />
              <button onClick={() => handleSend()} disabled={!inputValue.trim() || isLoading} className={cn("w-14 h-14 rounded-[22px] flex items-center justify-center transition-all", inputValue.trim() ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-400")}><Send size={24} /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
