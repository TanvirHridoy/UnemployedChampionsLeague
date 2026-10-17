export type SeedingPot = 1 | 2 | 3;

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  pot: SeedingPot;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  roster: Player[];
}

export type MatchEventType = 'goal' | 'assist' | 'save' | 'yellow_card' | 'red_card';

export interface MatchEvent {
  id: string;
  matchId: string;
  type: MatchEventType;
  minute: number;
  playerId: string;
  playerName: string;
  teamId: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
  detail?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed';

export interface Match {
  id: string;
  matchday: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  motmPlayerId?: string;
  events: MatchEvent[];
  venue?: string;
  dateLabel?: string;
}

export interface TeamStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  rank: number;
  zone: 'quarterfinal' | 'playoff' | 'eliminated';
}

export interface KnockoutTie {
  id: string;
  stage: 'playoff' | 'quarterfinal' | 'semifinal';
  tieNumber: number; // 1 to 4 for playoff/QF, 1 to 2 for SF
  name: string;
  teamAId: string | null; // higher seed
  teamBId: string | null; // lower seed
  leg1: {
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  };
  leg2: {
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  };
  penaltiesA?: number | null;
  penaltiesB?: number | null;
  winnerTeamId?: string | null;
}

export interface GrandFinal {
  id: string;
  teamAId: string | null;
  teamBId: string | null;
  regularHomeScore: number | null;
  regularAwayScore: number | null;
  extraTime: boolean;
  etHomeScore?: number | null;
  etAwayScore?: number | null;
  penaltiesA?: number | null;
  penaltiesB?: number | null;
  winnerTeamId?: string | null;
  status: MatchStatus;
  motmPlayerId?: string;
  venue: string;
  events: MatchEvent[];
}

export interface TournamentData {
  version: number;
  tournamentName: string;
  season: string;
  teams: Team[];
  matches: Match[];
  knockoutTies: KnockoutTie[];
  grandFinal: GrandFinal;
  lastUpdated: string;
}
