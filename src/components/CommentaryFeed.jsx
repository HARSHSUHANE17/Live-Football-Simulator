import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, AlertTriangle, AlertOctagon, Flag } from 'lucide-react';
import { TEAMS, EVENT_TYPES } from '../utils/gameConstants';

const CommentaryFeed = ({ events, teamConfig }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
        case EVENT_TYPES.GOAL: return '⚽';
        case EVENT_TYPES.YELLOW_CARD: return <div className="w-3 h-4 bg-yellow-400 rounded-[1px] border border-yellow-600 shadow-sm" />;
        case EVENT_TYPES.RED_CARD: return <div className="w-3 h-4 bg-red-600 rounded-[1px] border border-red-800 shadow-sm" />;
        case EVENT_TYPES.FOUL: return <Flag size={14} className="text-orange-500" />;
        case EVENT_TYPES.FULL_TIME: return '🏁';
        default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[400px] lg:h-[500px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare size={18} />
          Live Commentary
        </h3>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          {events.length} Events
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {events.slice().reverse().map((event) => {
            // Determine colors based on team ID
            const isHome = event.teamId === TEAMS.HOME.id;
            const borderColor = isHome ? 'border-red-500' : (event.teamId ? 'border-blue-500' : 'border-gray-400');
            const badgeColor = isHome ? 'bg-red-500' : 'bg-blue-500';
            
            // Special styling for cards
            let bgClass = '';
            if (event.type === EVENT_TYPES.YELLOW_CARD) bgClass = 'bg-yellow-50 border-l-yellow-400';
            if (event.type === EVENT_TYPES.RED_CARD) bgClass = 'bg-red-50 border-l-red-600';
            if (event.type === EVENT_TYPES.GOAL) bgClass = 'bg-green-50 border-l-green-500';
            if (event.type === EVENT_TYPES.FULL_TIME) bgClass = 'bg-slate-100 border-l-slate-800';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                className={`relative pl-4 border-l-4 ${bgClass || borderColor} py-2 rounded-r-md ${bgClass}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-gray-500">{event.time}'</span>
                  
                  {/* Display Full Team Name */}
                  {event.teamName && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badgeColor}`}>
                        {event.teamName}
                      </span>
                  )}
                  
                  {getEventIcon(event.type) && (
                      <span className="ml-auto text-lg leading-none">{getEventIcon(event.type)}</span>
                  )}
                </div>
                <p className={`text-sm leading-snug ${event.isGoal || event.isRedCard ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                  {event.text}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {events.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                <MessageSquare size={32} className="opacity-20" />
                <p className="text-sm">Waiting for kickoff...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CommentaryFeed;
