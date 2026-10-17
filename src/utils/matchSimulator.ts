import { Match, Team, MatchEvent } from '../types/tournament';

export function simulateSingleMatch(match: Match, teams: Team[]): Match {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  if (!homeTeam || !awayTeam) return match;

  // Rating advantage based on pot (Pot 1 slightly favored over Pot 2 & 3, plus slight home boost)
  const homePotBonus = (4 - homeTeam.pot) * 0.2 + 0.35;
  const awayPotBonus = (4 - awayTeam.pot) * 0.2;

  // Poisson-like distribution for realistic soccer goals (0 to 4 typical, rarely 5+)
  const generateGoals = (advantage: number) => {
    const base = Math.random() * (2.0 + advantage);
    if (base < 0.8) return 0;
    if (base < 1.7) return 1;
    if (base < 2.5) return 2;
    if (base < 3.2) return 3;
    if (base < 3.8) return 4;
    return 5;
  };

  const homeScore = generateGoals(homePotBonus);
  const awayScore = generateGoals(awayPotBonus);

  const events: MatchEvent[] = [];
  const homeGk = homeTeam.roster.find(p => p.position === 'GK') || homeTeam.roster[0];
  const awayGk = awayTeam.roster.find(p => p.position === 'GK') || awayTeam.roster[0];

  // Helper to pick scorer weighted by position (FWD > MID > DEF)
  const pickScorer = (team: Team) => {
    const fwds = team.roster.filter(p => p.position === 'FWD');
    const mids = team.roster.filter(p => p.position === 'MID');
    const defs = team.roster.filter(p => p.position === 'DEF');

    const rand = Math.random();
    if (fwds.length > 0 && rand < 0.65) {
      return fwds[Math.floor(Math.random() * fwds.length)];
    } else if (mids.length > 0 && rand < 0.90) {
      return mids[Math.floor(Math.random() * mids.length)];
    } else if (defs.length > 0) {
      return defs[Math.floor(Math.random() * defs.length)];
    }
    return team.roster[Math.floor(Math.random() * team.roster.length)];
  };

  const pickAssister = (team: Team, scorerId: string) => {
    const candidates = team.roster.filter(p => p.id !== scorerId && p.position !== 'GK');
    if (candidates.length === 0 || Math.random() < 0.25) return null; // unassisted goal
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // Generate Home Goals
  for (let i = 0; i < homeScore; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const scorer = pickScorer(homeTeam);
    const assister = pickAssister(homeTeam, scorer.id);
    const isPenalty = Math.random() < 0.12;

    events.push({
      id: `ev-${match.id}-h-${i}-${Date.now()}`,
      matchId: match.id,
      type: 'goal',
      minute,
      playerId: scorer.id,
      playerName: scorer.name,
      teamId: homeTeam.id,
      assistPlayerId: isPenalty ? undefined : assister?.id,
      assistPlayerName: isPenalty ? undefined : assister?.name,
      isPenalty,
    });
  }

  // Generate Away Goals
  for (let i = 0; i < awayScore; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const scorer = pickScorer(awayTeam);
    const assister = pickAssister(awayTeam, scorer.id);
    const isPenalty = Math.random() < 0.12;

    events.push({
      id: `ev-${match.id}-a-${i}-${Date.now()}`,
      matchId: match.id,
      type: 'goal',
      minute,
      playerId: scorer.id,
      playerName: scorer.name,
      teamId: awayTeam.id,
      assistPlayerId: isPenalty ? undefined : assister?.id,
      assistPlayerName: isPenalty ? undefined : assister?.name,
      isPenalty,
    });
  }

  // Saves
  const homeSavesCount = Math.floor(Math.random() * 5) + (awayScore > 2 ? 3 : 1);
  const awaySavesCount = Math.floor(Math.random() * 5) + (homeScore > 2 ? 3 : 1);

  if (homeGk) {
    events.push({
      id: `ev-${match.id}-hgk-${Date.now()}`,
      matchId: match.id,
      type: 'save',
      minute: 88,
      playerId: homeGk.id,
      playerName: homeGk.name,
      teamId: homeTeam.id,
      detail: `${homeSavesCount} saves`,
    });
  }
  if (awayGk) {
    events.push({
      id: `ev-${match.id}-agk-${Date.now()}`,
      matchId: match.id,
      type: 'save',
      minute: 89,
      playerId: awayGk.id,
      playerName: awayGk.name,
      teamId: awayTeam.id,
      detail: `${awaySavesCount} saves`,
    });
  }

  // Disciplinary Cards (0 to 3 yellows per team, rare red)
  const totalCards = Math.floor(Math.random() * 4) + 1;
  for (let c = 0; c < totalCards; c++) {
    const isHome = Math.random() > 0.5;
    const team = isHome ? homeTeam : awayTeam;
    const nonGk = team.roster.filter(p => p.position !== 'GK');
    const player = nonGk[Math.floor(Math.random() * nonGk.length)];
    if (!player) continue;

    const isRed = Math.random() < 0.04;
    events.push({
      id: `ev-${match.id}-card-${c}-${Date.now()}`,
      matchId: match.id,
      type: isRed ? 'red_card' : 'yellow_card',
      minute: Math.floor(Math.random() * 85) + 5,
      playerId: player.id,
      playerName: player.name,
      teamId: team.id,
    });
  }

  // Pick MOTM: preferentially someone who scored, or outstanding GK/player
  let motmPlayerId: string | undefined;
  const goalEvents = events.filter(e => e.type === 'goal');
  if (homeScore > awayScore) {
    const homeGoals = goalEvents.filter(e => e.teamId === homeTeam.id);
    motmPlayerId = homeGoals.length > 0 ? homeGoals[0].playerId : homeTeam.roster[0]?.id;
  } else if (awayScore > homeScore) {
    const awayGoals = goalEvents.filter(e => e.teamId === awayTeam.id);
    motmPlayerId = awayGoals.length > 0 ? awayGoals[0].playerId : awayTeam.roster[0]?.id;
  } else {
    // Draw
    if (goalEvents.length > 0) {
      motmPlayerId = goalEvents[Math.floor(Math.random() * goalEvents.length)].playerId;
    } else {
      // 0-0 draw: pick a goalkeeper!
      motmPlayerId = Math.random() > 0.5 ? homeGk?.id : awayGk?.id;
    }
  }

  // Sort events chronologically by minute
  events.sort((a, b) => a.minute - b.minute);

  return {
    ...match,
    status: 'completed',
    homeScore,
    awayScore,
    motmPlayerId,
    events,
  };
}

export function simulateMatchday(matchdayNumber: number, matches: Match[], teams: Team[]): Match[] {
  return matches.map(m => {
    if (m.matchday === matchdayNumber && m.status !== 'completed') {
      return simulateSingleMatch(m, teams);
    }
    return m;
  });
}

export function simulateAllRemaining(matches: Match[], teams: Team[]): Match[] {
  return matches.map(m => {
    if (m.status !== 'completed') {
      return simulateSingleMatch(m, teams);
    }
    return m;
  });
}
