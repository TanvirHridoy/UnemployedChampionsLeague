import { TournamentData, Match } from '../types/tournament';
import { 
  DEFAULT_TEAMS, 
  INITIAL_MATCHES, 
  INITIAL_KNOCKOUT_TIES, 
  INITIAL_GRAND_FINAL,
  SEED_SAMPLE_RESULTS 
} from './defaultTournamentData';
import { simulateMatchday, simulateAllRemaining } from '../utils/matchSimulator';
import { calculateStandings } from '../utils/standingsCalculator';

// 1. Fresh Season (Clean slate, 0 matches played)
export function getFreshSeasonPreset(): TournamentData {
  return {
    version: 3,
    tournamentName: 'Unemployed Champions League (UCL)',
    season: 'Season 3',
    teams: DEFAULT_TEAMS,
    matches: INITIAL_MATCHES.map(m => ({ ...m, status: 'scheduled', homeScore: null, awayScore: null, events: [], motmPlayerId: undefined })),
    knockoutTies: INITIAL_KNOCKOUT_TIES.map(t => ({
      ...t,
      teamAId: null,
      teamBId: null,
      leg1: { homeScore: null, awayScore: null, status: 'scheduled' },
      leg2: { homeScore: null, awayScore: null, status: 'scheduled' },
      penaltiesA: null,
      penaltiesB: null,
      winnerTeamId: null,
    })),
    grandFinal: {
      ...INITIAL_GRAND_FINAL,
      teamAId: null,
      teamBId: null,
      regularHomeScore: null,
      regularAwayScore: null,
      penaltiesA: null,
      penaltiesB: null,
      winnerTeamId: null,
      status: 'scheduled',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// 2. Mid-Season Live (Matchdays 1 to 5 completed)
export function getMidSeasonPreset(): TournamentData {
  let matches = SEED_SAMPLE_RESULTS(INITIAL_MATCHES, DEFAULT_TEAMS);
  // simulate matchdays 2, 3, 4, 5
  for (let d = 2; d <= 5; d++) {
    matches = simulateMatchday(d, matches, DEFAULT_TEAMS);
  }

  return {
    version: 3,
    tournamentName: 'Unemployed Champions League (UCL)',
    season: 'Season 3',
    teams: DEFAULT_TEAMS,
    matches,
    knockoutTies: INITIAL_KNOCKOUT_TIES,
    grandFinal: INITIAL_GRAND_FINAL,
    lastUpdated: new Date().toISOString(),
  };
}

// 3. Completed Regular Season (All 11 Matchdays played, Top 4 & Play-off Seeds auto-locked!)
export function getCompletedSeasonPreset(): TournamentData {
  const matches = simulateAllRemaining(INITIAL_MATCHES, DEFAULT_TEAMS);
  const standings = calculateStandings(DEFAULT_TEAMS, matches);

  const top4 = standings.slice(0, 4);
  const playoffTeams = standings.slice(4, 12);

  const seededKnockouts = INITIAL_KNOCKOUT_TIES.map(tie => {
    if (tie.stage === 'playoff') {
      if (tie.tieNumber === 1) return { ...tie, teamAId: playoffTeams[0]?.team.id || null, teamBId: playoffTeams[7]?.team.id || null };
      if (tie.tieNumber === 2) return { ...tie, teamAId: playoffTeams[1]?.team.id || null, teamBId: playoffTeams[6]?.team.id || null };
      if (tie.tieNumber === 3) return { ...tie, teamAId: playoffTeams[2]?.team.id || null, teamBId: playoffTeams[5]?.team.id || null };
      if (tie.tieNumber === 4) return { ...tie, teamAId: playoffTeams[3]?.team.id || null, teamBId: playoffTeams[4]?.team.id || null };
    }
    if (tie.stage === 'quarterfinal') {
      if (tie.tieNumber === 1) return { ...tie, teamAId: top4[0]?.team.id || null };
      if (tie.tieNumber === 2) return { ...tie, teamAId: top4[1]?.team.id || null };
      if (tie.tieNumber === 3) return { ...tie, teamAId: top4[2]?.team.id || null };
      if (tie.tieNumber === 4) return { ...tie, teamAId: top4[3]?.team.id || null };
    }
    return tie;
  });

  return {
    version: 3,
    tournamentName: 'Unemployed Champions League (UCL)',
    season: 'Season 3',
    teams: DEFAULT_TEAMS,
    matches,
    knockoutTies: seededKnockouts,
    grandFinal: INITIAL_GRAND_FINAL,
    lastUpdated: new Date().toISOString(),
  };
}

// 4. Grand Final Showdown (Knockouts played through to the final!)
export function getGrandFinalPreset(): TournamentData {
  const completedSeason = getCompletedSeasonPreset();
  const ties = [...completedSeason.knockoutTies];

  // Playoff ties results
  for (const po of ties.filter(t => t.stage === 'playoff')) {
    po.leg1 = { homeScore: 1, awayScore: 2, status: 'completed' };
    po.leg2 = { homeScore: 2, awayScore: 0, status: 'completed' };
    po.winnerTeamId = po.teamAId; // higher seed wins
  }

  // Populate QF team B
  const po1 = ties.find(t => t.id === 'po-1');
  const po2 = ties.find(t => t.id === 'po-2');
  const po3 = ties.find(t => t.id === 'po-3');
  const po4 = ties.find(t => t.id === 'po-4');

  const qf1 = ties.find(t => t.id === 'qf-1');
  const qf2 = ties.find(t => t.id === 'qf-2');
  const qf3 = ties.find(t => t.id === 'qf-3');
  const qf4 = ties.find(t => t.id === 'qf-4');

  if (qf1) qf1.teamBId = po4?.winnerTeamId || null;
  if (qf2) qf2.teamBId = po3?.winnerTeamId || null;
  if (qf3) qf3.teamBId = po2?.winnerTeamId || null;
  if (qf4) qf4.teamBId = po1?.winnerTeamId || null;

  for (const qf of ties.filter(t => t.stage === 'quarterfinal')) {
    qf.leg1 = { homeScore: 2, awayScore: 1, status: 'completed' };
    qf.leg2 = { homeScore: 3, awayScore: 1, status: 'completed' };
    qf.winnerTeamId = qf.teamAId;
  }

  // Semifinals
  const sf1 = ties.find(t => t.id === 'sf-1');
  const sf2 = ties.find(t => t.id === 'sf-2');

  if (sf1) {
    sf1.teamAId = qf1?.winnerTeamId || null;
    sf1.teamBId = qf4?.winnerTeamId || null;
    sf1.leg1 = { homeScore: 1, awayScore: 1, status: 'completed' };
    sf1.leg2 = { homeScore: 2, awayScore: 1, status: 'completed' };
    sf1.winnerTeamId = sf1.teamAId;
  }

  if (sf2) {
    sf2.teamAId = qf2?.winnerTeamId || null;
    sf2.teamBId = qf3?.winnerTeamId || null;
    sf2.leg1 = { homeScore: 0, awayScore: 2, status: 'completed' };
    sf2.leg2 = { homeScore: 3, awayScore: 1, status: 'completed' };
    sf2.winnerTeamId = sf2.teamAId;
  }

  const grandFinal: TournamentData['grandFinal'] = {
    ...INITIAL_GRAND_FINAL,
    teamAId: sf1?.winnerTeamId || DEFAULT_TEAMS[0].id,
    teamBId: sf2?.winnerTeamId || DEFAULT_TEAMS[5].id,
    regularHomeScore: 2,
    regularAwayScore: 2,
    extraTime: true,
    etHomeScore: 3,
    etAwayScore: 2,
    penaltiesA: null,
    penaltiesB: null,
    winnerTeamId: sf1?.winnerTeamId || DEFAULT_TEAMS[0].id,
    status: 'completed',
    motmPlayerId: undefined,
  };

  return {
    ...completedSeason,
    knockoutTies: ties,
    grandFinal,
    lastUpdated: new Date().toISOString(),
  };
}
