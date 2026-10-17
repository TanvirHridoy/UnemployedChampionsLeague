import { Team, Match } from '../types/tournament';

export interface ScorerStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  goals: number;
  penalties: number;
  matchesPlayed: number;
}

export interface AssistStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  assists: number;
}

export interface GoalkeeperStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  saves: number;
  cleanSheets: number;
  goalsConceded: number;
}

export interface DisciplineStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  yellowCards: number;
  redCards: number;
  points: number; // 1 pt per yellow, 3 pts per red
}

export interface MotmStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  awards: number;
}

export function calculateTournamentStats(teams: Team[], matches: Match[]) {
  const teamMap = new Map<string, Team>(teams.map(t => [t.id, t]));
  const playerMap = new Map<string, { player: any; team: Team }>();

  for (const team of teams) {
    for (const player of team.roster) {
      playerMap.set(player.id, { player, team });
    }
  }

  // Count matches played per team
  const teamMatchesCount = new Map<string, number>();
  for (const m of matches) {
    if (m.status === 'completed') {
      teamMatchesCount.set(m.homeTeamId, (teamMatchesCount.get(m.homeTeamId) || 0) + 1);
      teamMatchesCount.set(m.awayTeamId, (teamMatchesCount.get(m.awayTeamId) || 0) + 1);
    }
  }

  const scorersMap = new Map<string, ScorerStat>();
  const assistsMap = new Map<string, AssistStat>();
  const savesMap = new Map<string, { saves: number; playerId: string; playerName: string; teamId: string }>();
  const cardsMap = new Map<string, DisciplineStat>();
  const motmMap = new Map<string, MotmStat>();

  for (const match of matches) {
    if (match.status !== 'completed') continue;

    // MOTM
    if (match.motmPlayerId) {
      const pInfo = playerMap.get(match.motmPlayerId);
      if (pInfo) {
        const cur = motmMap.get(match.motmPlayerId) || {
          playerId: pInfo.player.id,
          playerName: pInfo.player.name,
          teamId: pInfo.team.id,
          teamName: pInfo.team.name,
          teamLogo: pInfo.team.logo,
          awards: 0,
        };
        cur.awards += 1;
        motmMap.set(match.motmPlayerId, cur);
      }
    }

    // Events
    for (const ev of match.events) {
      if (ev.type === 'goal' && !ev.isOwnGoal) {
        const t = teamMap.get(ev.teamId);
        const cur = scorersMap.get(ev.playerId) || {
          playerId: ev.playerId,
          playerName: ev.playerName,
          teamId: ev.teamId,
          teamName: t?.name || 'Unknown',
          teamLogo: t?.logo || '',
          goals: 0,
          penalties: 0,
          matchesPlayed: teamMatchesCount.get(ev.teamId) || 1,
        };
        cur.goals += 1;
        if (ev.isPenalty) cur.penalties += 1;
        scorersMap.set(ev.playerId, cur);

        // Assist
        if (ev.assistPlayerId && ev.assistPlayerName) {
          const aCur = assistsMap.get(ev.assistPlayerId) || {
            playerId: ev.assistPlayerId,
            playerName: ev.assistPlayerName,
            teamId: ev.teamId,
            teamName: t?.name || 'Unknown',
            teamLogo: t?.logo || '',
            assists: 0,
          };
          aCur.assists += 1;
          assistsMap.set(ev.assistPlayerId, aCur);
        }
      }

      if (ev.type === 'assist') {
        const t = teamMap.get(ev.teamId);
        const aCur = assistsMap.get(ev.playerId) || {
          playerId: ev.playerId,
          playerName: ev.playerName,
          teamId: ev.teamId,
          teamName: t?.name || 'Unknown',
          teamLogo: t?.logo || '',
          assists: 0,
        };
        aCur.assists += 1;
        assistsMap.set(ev.playerId, aCur);
      }

      if (ev.type === 'save') {
        const cur = savesMap.get(ev.playerId) || {
          saves: 0,
          playerId: ev.playerId,
          playerName: ev.playerName,
          teamId: ev.teamId,
        };
        // extract save count if in detail or count as 1
        let count = 1;
        if (ev.detail && ev.detail.includes('save')) {
          const matchNum = ev.detail.match(/\d+/);
          if (matchNum) count = parseInt(matchNum[0], 10);
        }
        cur.saves += count;
        savesMap.set(ev.playerId, cur);
      }

      if (ev.type === 'yellow_card' || ev.type === 'red_card') {
        const t = teamMap.get(ev.teamId);
        const cur = cardsMap.get(ev.playerId) || {
          playerId: ev.playerId,
          playerName: ev.playerName,
          teamId: ev.teamId,
          teamName: t?.name || 'Unknown',
          teamLogo: t?.logo || '',
          yellowCards: 0,
          redCards: 0,
          points: 0,
        };
        if (ev.type === 'yellow_card') {
          cur.yellowCards += 1;
          cur.points += 1;
        } else {
          cur.redCards += 1;
          cur.points += 3;
        }
        cardsMap.set(ev.playerId, cur);
      }
    }
  }

  // Goalkeepers stats: calculate clean sheets
  const goalkeepersMap = new Map<string, GoalkeeperStat>();

  // Find all designated GKs in squads
  for (const team of teams) {
    const gk = team.roster.find(p => p.position === 'GK') || team.roster[0];
    if (gk) {
      let cleanSheets = 0;
      let goalsConceded = 0;

      for (const m of matches) {
        if (m.status !== 'completed' || m.homeScore === null || m.awayScore === null) continue;
        if (m.homeTeamId === team.id) {
          goalsConceded += m.awayScore;
          if (m.awayScore === 0) cleanSheets += 1;
        } else if (m.awayTeamId === team.id) {
          goalsConceded += m.homeScore;
          if (m.homeScore === 0) cleanSheets += 1;
        }
      }

      const registeredSaves = savesMap.get(gk.id)?.saves || 0;

      goalkeepersMap.set(gk.id, {
        playerId: gk.id,
        playerName: gk.name,
        teamId: team.id,
        teamName: team.name,
        teamLogo: team.logo,
        saves: registeredSaves,
        cleanSheets,
        goalsConceded,
      });
    }
  }

  // Also include any other player that has logged saves
  for (const [pId, sData] of savesMap.entries()) {
    if (!goalkeepersMap.has(pId)) {
      const pInfo = playerMap.get(pId);
      goalkeepersMap.set(pId, {
        playerId: pId,
        playerName: sData.playerName,
        teamId: sData.teamId,
        teamName: pInfo?.team.name || 'Team',
        teamLogo: pInfo?.team.logo || '',
        saves: sData.saves,
        cleanSheets: 0,
        goalsConceded: 0,
      });
    }
  }

  const topScorers = Array.from(scorersMap.values()).sort((a, b) => b.goals - a.goals || a.matchesPlayed - b.matchesPlayed);
  const topAssists = Array.from(assistsMap.values()).sort((a, b) => b.assists - a.assists);
  const topGoalkeepers = Array.from(goalkeepersMap.values()).sort((a, b) => b.saves - a.saves || b.cleanSheets - a.cleanSheets);
  const topDiscipline = Array.from(cardsMap.values()).sort((a, b) => b.points - a.points || b.redCards - a.redCards);
  const topMotm = Array.from(motmMap.values()).sort((a, b) => b.awards - a.awards);

  return {
    topScorers,
    topAssists,
    topGoalkeepers,
    topDiscipline,
    topMotm,
  };
}
