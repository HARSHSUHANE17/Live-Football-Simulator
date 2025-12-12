import React from 'react';
import { motion } from 'framer-motion';
import { TEAMS } from '../utils/gameConstants';

const Field = ({ ballPosition, lastEvent, teamConfig }) => {
  // Determine ball ring color based on possession
  const getRingColor = () => {
    if (!lastEvent) return 'border-gray-300';
    return lastEvent.teamId === TEAMS.HOME.id ? 'border-red-500' : 'border-blue-500';
  };

  return (
    <div className="relative w-full aspect-[16/9] bg-emerald-600 rounded-lg overflow-hidden border-4 border-emerald-800 shadow-inner select-none group cursor-crosshair">
      {/* Field Patterns (Stripes) */}
      <div className="absolute inset-0 flex">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-700/50'}`}></div>
        ))}
      </div>

      {/* Field Markings */}
      <div className="absolute inset-4 border-2 border-white/60 rounded-sm">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60 -translate-x-1/2"></div>
        
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 w-32 h-32 border-2 border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/80 rounded-full"></div>
        </div>

        {/* Penalty Areas */}
        {/* Left (Home) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 border-r-2 border-y-2 border-white/60 bg-transparent"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 border-r-2 border-y-2 border-white/60 bg-transparent"></div>
        
        {/* Right (Away) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 border-l-2 border-y-2 border-white/60 bg-transparent"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 border-l-2 border-y-2 border-white/60 bg-transparent"></div>
      </div>

      {/* The Ball */}
      <motion.div
        className="absolute w-4 h-4 bg-white rounded-full shadow-lg z-10 border border-gray-300"
        animate={{
          left: `${ballPosition.x}%`,
          top: `${ballPosition.y}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 15,
          duration: 1.5
        }}
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        {/* Ball indicator ring for visibility */}
        <div className={`absolute -inset-2 rounded-full border-2 opacity-50 animate-ping ${getRingColor()}`}></div>
      </motion.div>

      {/* Team Indicators */}
      <div className="absolute top-2 left-2 text-white/60 font-bold text-xs bg-black/20 px-2 py-1 rounded">
        {teamConfig ? teamConfig[TEAMS.HOME.id].name : 'HOME'}
      </div>
      <div className="absolute top-2 right-2 text-white/60 font-bold text-xs bg-black/20 px-2 py-1 rounded">
        {teamConfig ? teamConfig[TEAMS.AWAY.id].name : 'AWAY'}
      </div>
    </div>
  );
};

export default Field;
