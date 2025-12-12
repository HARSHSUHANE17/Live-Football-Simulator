import React from 'react';
import { TEAMS } from '../utils/gameConstants';
import { Clock } from 'lucide-react';

const Scoreboard = ({ score, time, isLive, teamConfig, cards }) => {
  const homeTeam = teamConfig ? teamConfig[TEAMS.HOME.id] : TEAMS.HOME;
  const awayTeam = teamConfig ? teamConfig[TEAMS.AWAY.id] : TEAMS.AWAY;

  return (
    <div className="w-full bg-slate-900 text-white p-3 md:p-4 rounded-xl shadow-lg border border-slate-800 mb-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Home Team */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <div className="flex flex-col items-end">
             <span className="text-sm md:text-xl font-bold text-right leading-tight">{homeTeam.name}</span>
             {cards && cards.home.red > 0 && (
                 <div className="flex gap-0.5 mt-1">
                    {[...Array(cards.home.red)].map((_, i) => (
                        <div key={i} className="w-2 h-3 bg-red-600 rounded-[1px] border border-white/20" title="Red Card"></div>
                    ))}
                 </div>
             )}
          </div>
          
          <div className={`w-2 md:w-3 h-8 md:h-12 ${homeTeam.color} rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]`}></div>
          <span className="text-3xl md:text-5xl font-mono font-bold w-10 md:w-16 text-center">{score.home}</span>
        </div>

        {/* Timer / Status */}
        <div className="flex flex-col items-center px-2 md:px-8">
          <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 md:gap-2 mb-1 md:mb-2 border ${isLive ? 'bg-slate-800 border-green-900/50' : 'bg-slate-800 border-slate-700'}`}>
            <Clock size={12} className={isLive ? "animate-pulse text-green-400" : "text-gray-400"} />
            <span className={`text-xs md:text-sm font-mono ${isLive ? 'text-white' : 'text-gray-400'}`}>{time}'</span>
          </div>
          <div className="text-[8px] md:text-[10px] text-slate-400 tracking-widest uppercase font-bold text-center">
            {time >= 90 ? 'Full Time' : (isLive ? 'Live' : 'Paused')}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-start">
          <span className="text-3xl md:text-5xl font-mono font-bold w-10 md:w-16 text-center">{score.away}</span>
          <div className={`w-2 md:w-3 h-8 md:h-12 ${awayTeam.color} rounded-sm shadow-[0_0_10px_rgba(37,99,235,0.5)]`}></div>
          <div className="flex flex-col items-start">
             <span className="text-sm md:text-xl font-bold text-left leading-tight">{awayTeam.name}</span>
             {cards && cards.away.red > 0 && (
                 <div className="flex gap-0.5 mt-1">
                    {[...Array(cards.away.red)].map((_, i) => (
                        <div key={i} className="w-2 h-3 bg-red-600 rounded-[1px] border border-white/20" title="Red Card"></div>
                    ))}
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
