import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import Scoreboard from './components/Scoreboard';
import Field from './components/Field';
import CommentaryFeed from './components/CommentaryFeed';
import { generateNextEvent } from './utils/gameLogic';
import { TEAMS, EVENT_TYPES } from './utils/gameConstants';

function App() {
  // Game Configuration State
  const [teamConfig, setTeamConfig] = useState({
    [TEAMS.HOME.id]: { ...TEAMS.HOME },
    [TEAMS.AWAY.id]: { ...TEAMS.AWAY }
  });

  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [shotsOnTarget, setShotsOnTarget] = useState({ home: 0, away: 0 });
  const [possessionCounts, setPossessionCounts] = useState({ home: 0, away: 0 });
  const [cards, setCards] = useState({ home: { yellow: 0, red: 0 }, away: { yellow: 0, red: 0 } });
  const [time, setTime] = useState(0);
  const [events, setEvents] = useState([]);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  
  const timerRef = useRef(null);

  // Unified State Updater
  const processEvent = (newEvent) => {
    // Update State
    setEvents(prev => [...prev, newEvent]);
    setBallPosition(newEvent.position);
    setTime(newEvent.time);

    // Update Possession Count
    setPossessionCounts(prev => ({
      ...prev,
      [newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away']: prev[newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away'] + 1
    }));

    // Update Score
    if (newEvent.isGoal) {
      setScore(prev => ({
        ...prev,
        [newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away']: prev[newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away'] + 1
      }));
      // Trigger mini confetti for goal
      triggerGoalConfetti(newEvent.teamId);
    }

    // Update Shots on Target
    if (newEvent.isOnTarget) {
      setShotsOnTarget(prev => ({
        ...prev,
        [newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away']: prev[newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away'] + 1
      }));
    }

    // Update Cards
    if (newEvent.isYellowCard || newEvent.isRedCard) {
        setCards(prev => {
            const teamKey = newEvent.teamId === TEAMS.HOME.id ? 'home' : 'away';
            return {
                ...prev,
                [teamKey]: {
                    ...prev[teamKey],
                    yellow: prev[teamKey].yellow + (newEvent.isYellowCard ? 1 : 0),
                    red: prev[teamKey].red + (newEvent.isRedCard ? 1 : 0)
                }
            };
        });
    }

    if (newEvent.time >= 90) {
        finishGame();
    }
  };

  const handleTick = () => {
    if (time >= 90) {
      finishGame();
      return;
    }
    const lastEvent = events[events.length - 1];
    const newEvent = generateNextEvent({ time }, lastEvent, teamConfig);
    processEvent(newEvent);
  };

  const finishGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    
    // Add Full Time Event if not already there
    const lastEvent = events[events.length - 1];
    if (lastEvent && lastEvent.type !== EVENT_TYPES.FULL_TIME) {
        const fullTimeEvent = {
            id: Date.now() + Math.random(),
            time: 90,
            type: EVENT_TYPES.FULL_TIME,
            teamId: null,
            text: "FULL TIME! The referee blows the final whistle.",
            position: { x: 50, y: 50 }
        };
        setEvents(prev => [...prev, fullTimeEvent]);
    }
    
    triggerConfetti();
  };

  const triggerGoalConfetti = (teamId) => {
    const color = teamConfig[teamId].primaryColor;
    confetti({
        particleCount: 50,
        spread: 40,
        origin: { x: teamId === TEAMS.HOME.id ? 0.2 : 0.8, y: 0.6 },
        colors: [color, '#ffffff']
    });
  }

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [teamConfig[TEAMS.HOME.id].primaryColor, '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [teamConfig[TEAMS.AWAY.id].primaryColor, '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      timerRef.current = setInterval(handleTick, 1200); 
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, isGameOver, time, events]);

  const resetGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setScore({ home: 0, away: 0 });
    setShotsOnTarget({ home: 0, away: 0 });
    setPossessionCounts({ home: 0, away: 0 });
    setCards({ home: { yellow: 0, red: 0 }, away: { yellow: 0, red: 0 } });
    setTime(0);
    setEvents([]);
    setBallPosition({ x: 50, y: 50 });
  };

  const handleTeamNameChange = (teamId, newName) => {
    setTeamConfig(prev => ({
      ...prev,
      [teamId]: { ...prev[teamId], name: newName, shortName: newName.substring(0, 3).toUpperCase() }
    }));
  };

  // Calculate Possession Percentage
  const totalPossessionEvents = possessionCounts.home + possessionCounts.away;
  const homePossession = totalPossessionEvents === 0 ? 0 : Math.round((possessionCounts.home / totalPossessionEvents) * 100);
  const awayPossession = totalPossessionEvents === 0 ? 0 : 100 - homePossession;

  const getWinner = () => {
    if (score.home > score.away) return teamConfig[TEAMS.HOME.id];
    if (score.away > score.home) return teamConfig[TEAMS.AWAY.id];
    return null; // Draw
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 z-40 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span className="bg-slate-900 text-white px-2 py-0.5 md:py-1 rounded text-sm md:text-base">LIVE</span>
            FOOTBALL SIM
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
             {/* Team Name Inputs */}
             <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner">
                <input 
                  type="text" 
                  value={teamConfig[TEAMS.HOME.id].name}
                  onChange={(e) => handleTeamNameChange(TEAMS.HOME.id, e.target.value)}
                  disabled={isPlaying || events.length > 0}
                  className="w-24 md:w-32 bg-transparent text-right font-bold text-sm focus:outline-none focus:text-red-600 disabled:opacity-70 truncate"
                  placeholder="Home Team"
                />
                <span className="text-gray-300 font-bold text-xs">VS</span>
                <input 
                  type="text" 
                  value={teamConfig[TEAMS.AWAY.id].name}
                  onChange={(e) => handleTeamNameChange(TEAMS.AWAY.id, e.target.value)}
                  disabled={isPlaying || events.length > 0}
                  className="w-24 md:w-32 bg-transparent text-left font-bold text-sm focus:outline-none focus:text-blue-600 disabled:opacity-70 truncate"
                  placeholder="Away Team"
                />
             </div>

            <div className="flex gap-2 items-center">
              {!isGameOver && (
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold transition-colors shadow-sm text-sm md:text-base ${
                    isPlaying 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Match</>}
                </button>
              )}
              
              <button 
                onClick={resetGame}
                className="p-1.5 md:p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                title="Reset Match"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <Scoreboard score={score} time={time} isLive={isPlaying} teamConfig={teamConfig} cards={cards} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Stage: Field */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-1 rounded-xl shadow-lg relative z-0">
                <Field ballPosition={ballPosition} lastEvent={events[events.length - 1]} teamConfig={teamConfig} />
                </div>
                
                {/* Stats / Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Possession Stat */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Possession</span>
                        {totalPossessionEvents === 0 && <span className="text-[10px] text-gray-300">(Waiting for kickoff)</span>}
                        </h4>
                        
                        <div className="flex items-center gap-3 mb-1">
                        <span className={`text-sm font-bold ${teamConfig[TEAMS.HOME.id].textColor}`}>{homePossession}%</span>
                        <div className="h-2.5 flex-1 bg-gray-100 rounded-full overflow-hidden flex">
                                {totalPossessionEvents > 0 ? (
                                    <>
                                        <div 
                                        className="h-full transition-all duration-500 ease-out" 
                                        style={{ width: `${homePossession}%`, backgroundColor: teamConfig[TEAMS.HOME.id].primaryColor }}
                                        ></div>
                                        <div 
                                        className="h-full transition-all duration-500 ease-out" 
                                        style={{ width: `${awayPossession}%`, backgroundColor: teamConfig[TEAMS.AWAY.id].primaryColor }}
                                        ></div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gray-200"></div>
                                )}
                            </div>
                            <span className={`text-sm font-bold ${teamConfig[TEAMS.AWAY.id].textColor}`}>{awayPossession}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                            <span>{teamConfig[TEAMS.HOME.id].name}</span>
                            <span>{teamConfig[TEAMS.AWAY.id].name}</span>
                        </div>
                    </div>

                    {/* Shots on Target Stat */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shots on Target</h4>
                        <div className="flex justify-between items-center px-4">
                            <div className="text-center flex-1">
                                <span className={`text-3xl font-black block ${teamConfig[TEAMS.HOME.id].textColor}`}>{shotsOnTarget.home}</span>
                                <span className="text-[11px] md:text-xs text-gray-500 font-bold block truncate max-w-[100px] mx-auto" title={teamConfig[TEAMS.HOME.id].name}>
                                    {teamConfig[TEAMS.HOME.id].name}
                                </span>
                            </div>
                            <span className="text-xs text-gray-300 font-bold px-2">VS</span>
                            <div className="text-center flex-1">
                                <span className={`text-3xl font-black block ${teamConfig[TEAMS.AWAY.id].textColor}`}>{shotsOnTarget.away}</span>
                                <span className="text-[11px] md:text-xs text-gray-500 font-bold block truncate max-w-[100px] mx-auto" title={teamConfig[TEAMS.AWAY.id].name}>
                                    {teamConfig[TEAMS.AWAY.id].name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar: Commentary */}
            <div className="lg:col-span-1">
                <CommentaryFeed events={events} teamConfig={teamConfig} />
            </div>
            </div>
        </div>
      </main>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center transform scale-100 animate-in zoom-in-95 duration-300">
                <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">FULL TIME</h2>
                
                <div className="flex justify-center items-center gap-6 my-6">
                    <div className="text-center w-1/3">
                        <div className="text-5xl font-black text-slate-800">{score.home}</div>
                        <div className="text-sm font-bold text-gray-500 mt-1">{teamConfig[TEAMS.HOME.id].name}</div>
                    </div>
                    <div className="text-2xl font-black text-gray-300">-</div>
                    <div className="text-center w-1/3">
                        <div className="text-5xl font-black text-slate-800">{score.away}</div>
                        <div className="text-sm font-bold text-gray-500 mt-1">{teamConfig[TEAMS.AWAY.id].name}</div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                    {getWinner() ? (
                        <>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Winner</p>
                            <p className={`text-2xl font-black ${getWinner().id === TEAMS.HOME.id ? 'text-red-600' : 'text-blue-600'}`}>
                                {getWinner().name}
                            </p>
                        </>
                    ) : (
                        <p className="text-xl font-black text-slate-600">It's a Draw!</p>
                    )}
                </div>

                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={resetGame}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 w-full shadow-lg shadow-slate-900/20"
                    >
                        Start New Match
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
