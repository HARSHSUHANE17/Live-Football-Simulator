import { TEAMS, EVENT_TYPES, PLAYERS } from './gameConstants';

const getRandomPlayer = (teamId) => {
  const squad = PLAYERS[teamId];
  return squad[Math.floor(Math.random() * squad.length)];
};

export const generateNextEvent = (currentStats, lastEvent, teamConfig) => {
  const time = currentStats.time + Math.floor(Math.random() * 2) + 1; // Advance time 1-3 mins
  let type = EVENT_TYPES.PASS;
  
  // Resolve the team object based on ID but use dynamic names from teamConfig
  let activeTeamId = lastEvent ? lastEvent.teamId : TEAMS.HOME.id;
  let activeTeamConfig = teamConfig[activeTeamId];

  let x = 50;
  let y = 50;
  let text = '';
  let isGoal = false;
  let isOnTarget = false;
  let isYellowCard = false;
  let isRedCard = false;

  const rand = Math.random();

  // If just started or goal previously
  if (!lastEvent || lastEvent.type === EVENT_TYPES.GOAL || lastEvent.type === EVENT_TYPES.KICKOFF) {
    type = EVENT_TYPES.PASS;
    x = 50;
    y = 50;
    text = `Kick off by ${activeTeamConfig.name}. The game is underway!`;
  } else {
    // Determine possession change
    if (rand > 0.75) {
      // Switch possession
      activeTeamId = activeTeamId === TEAMS.HOME.id ? TEAMS.AWAY.id : TEAMS.HOME.id;
      activeTeamConfig = teamConfig[activeTeamId];
      
      // Chance for Foul/Interception
      if (Math.random() > 0.7) {
         type = EVENT_TYPES.FOUL;
         x = lastEvent.position.x;
         y = lastEvent.position.y;
         
         const cardRand = Math.random();
         const fouler = getRandomPlayer(activeTeamId); 
         
         text = `Foul committed by ${fouler} (${activeTeamConfig.name}).`;
         
         if (cardRand > 0.95) {
             type = EVENT_TYPES.RED_CARD;
             isRedCard = true;
             text += ` It's a RED CARD! ${fouler} is sent off! ${activeTeamConfig.name} are down to 10 men.`;
         } else if (cardRand > 0.7) {
             type = EVENT_TYPES.YELLOW_CARD;
             isYellowCard = true;
             text += ` The referee shows a Yellow Card to ${fouler}.`;
         }
      } else {
         type = EVENT_TYPES.INTERCEPTION;
         text = `Interception! ${activeTeamConfig.name} wins the ball back.`;
         x = lastEvent.position.x;
         y = lastEvent.position.y;
      }
    } else {
        // Continue possession
        const actionRand = Math.random();
        
        if (actionRand > 0.85) {
          // Shot attempt
          type = EVENT_TYPES.SHOT;
          const targetGoalX = activeTeamId === TEAMS.HOME.id ? 95 : 5; 
          x = targetGoalX;
          y = 50 + (Math.random() * 20 - 10); 
          
          const shotOutcome = Math.random();
          
          if (shotOutcome > 0.75) {
            // GOAL
            type = EVENT_TYPES.GOAL;
            isGoal = true;
            isOnTarget = true;
            text = `GOAL!!! ${getRandomPlayer(activeTeamId)} scores a screamer for ${activeTeamConfig.name}!`;
          } else if (shotOutcome > 0.45) {
            // SAVED
            isOnTarget = true;
            text = `Shot by ${getRandomPlayer(activeTeamId)}! Saved by the keeper.`;
          } else {
            // MISSED
            isOnTarget = false;
            y = y + (Math.random() > 0.5 ? 20 : -20); 
            text = `${getRandomPlayer(activeTeamId)} shoots... but it's wide off the mark.`;
          }
        } else if (actionRand > 0.6) {
          // Dribble
          type = EVENT_TYPES.DRIBBLE;
          const direction = activeTeamId === TEAMS.HOME.id ? 1 : -1;
          x = Math.min(95, Math.max(5, lastEvent.position.x + (Math.random() * 20 + 10) * direction));
          y = Math.min(90, Math.max(10, lastEvent.position.y + (Math.random() * 40 - 20)));
          text = `${getRandomPlayer(activeTeamId)} dribbles past the defender.`;
        } else {
          // Pass
          type = EVENT_TYPES.PASS;
          const direction = activeTeamId === TEAMS.HOME.id ? 1 : -1;
          x = Math.min(95, Math.max(5, lastEvent.position.x + (Math.random() * 30 - 5) * direction));
          y = Math.random() * 100;
          text = `${getRandomPlayer(activeTeamId)} plays a pass.`;
        }
    }
  }

  return {
    id: Date.now() + Math.random(), // Added random fraction to ensure uniqueness
    time,
    type,
    teamId: activeTeamId,
    teamName: activeTeamConfig.name,
    teamShortName: activeTeamConfig.shortName,
    text,
    position: { x, y },
    isGoal,
    isOnTarget,
    isYellowCard,
    isRedCard
  };
};
