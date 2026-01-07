
import React from 'react';
import { motion } from 'framer-motion';

interface OmniLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OmniLogo: React.FC<OmniLogoProps> = ({ size = 'md', className }) => {
  const dimensions = {
    sm: { container: 'w-10 h-10', icon: '24', r: '6', stroke: '2', blur: 'blur-md' },
    md: { container: 'w-14 h-14', icon: '34', r: '9', stroke: '3', blur: 'blur-2xl' },
    lg: { container: 'w-20 h-20', icon: '48', r: '12', stroke: '4', blur: 'blur-3xl' }
  }[size];

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        whileHover={{ y: -2, scale: 1.05 }}
        className={`${dimensions.container} bg-zinc-950 rounded-[18px] flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/10 transition-all duration-700 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/40`}
      >
        {/* Mesh Glow Background - Living Gradient */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-tr from-indigo-600/40 via-purple-500/10 to-sky-400/40 ${dimensions.blur}`}
        />

        {/* Internal Glint Sweep */}
        <motion.div 
          animate={{ x: ['-150%', '150%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
        />
        
        {/* Minimalist Geometric O Icon */}
        <svg 
          width={dimensions.icon} 
          height={dimensions.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative z-10 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
        >
          <circle cx="12" cy="12" r={dimensions.r} stroke="white" strokeWidth="2" strokeOpacity="0.05" />
          
          <motion.path 
            d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" 
            stroke="url(#omni-grad-shared)" 
            strokeWidth={dimensions.stroke} 
            strokeLinecap="round" 
            strokeDasharray="30 60"
            animate={{ strokeDashoffset: [0, -90] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <motion.path 
            d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeOpacity="0.4"
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              strokeWidth: [1.5, 2, 1.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.circle 
            cx="12" cy="12" r="1.5" 
            fill="white"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <defs>
            <linearGradient id="omni-grad-shared" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Dynamic Outer Orbiting Ring */}
      <div className="absolute -inset-2 bg-indigo-500/5 rounded-[26px] opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-sm" />
    </div>
  );
};
