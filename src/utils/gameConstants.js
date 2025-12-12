export const TEAMS = {
  HOME: {
    id: 'home',
    name: 'Red Devils',
    shortName: 'RED',
    color: 'bg-red-600',
    textColor: 'text-red-600',
    primaryColor: '#dc2626'
  },
  AWAY: {
    id: 'away',
    name: 'Blue Wings',
    shortName: 'BLU',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    primaryColor: '#2563eb'
  }
};

export const PLAYERS = {
  [TEAMS.HOME.id]: ['Rashford', 'Fernandes', 'Casemiro', 'Varane', 'Onana', 'Shaw', 'Dalot', 'Mount', 'Antony', 'Martinez', 'Hojlund'],
  [TEAMS.AWAY.id]: ['Haaland', 'De Bruyne', 'Rodri', 'Dias', 'Ederson', 'Walker', 'Gvardiol', 'Silva', 'Foden', 'Stones', 'Alvarez']
};

export const EVENT_TYPES = {
  KICKOFF: 'KICKOFF',
  PASS: 'PASS',
  DRIBBLE: 'DRIBBLE',
  SHOT: 'SHOT',
  GOAL: 'GOAL',
  INTERCEPTION: 'INTERCEPTION',
  FOUL: 'FOUL',
  YELLOW_CARD: 'YELLOW_CARD',
  RED_CARD: 'RED_CARD',
  OUT: 'OUT',
  FULL_TIME: 'FULL_TIME'
};

// Field coordinates are 0-100 (percentage)
// Home goal is at x=0, Away goal is at x=100
export const FIELD_ZONES = {
  HOME_GOAL: { x: 5, y: 50 },
  AWAY_GOAL: { x: 95, y: 50 },
  CENTER: { x: 50, y: 50 },
  TOP_WING: { y: 10 },
  BOTTOM_WING: { y: 90 }
};
