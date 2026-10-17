import { Team, Match, TeamStanding } from '../types/tournament';

export function calculateStandings(teams: Team[], matches: Match[]): TeamStanding[] {
  const standingsMap = new Map<string, {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
  }>();

  // Initialize
  for (const team of teams) {
    standingsMap.set(team.id, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    });
  }

  // Process matches in matchday order
  const completedMatches = matches
    .filter(m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
    .sort((a, b) => a.matchday - b.matchday);

  for (const match of completedMatches) {
    const home = standingsMap.get(match.homeTeamId);
    const away = standingsMap.get(match.awayTeamId);

    if (!home || !away) continue;

    const hs = match.homeScore as number;
    const as = match.awayScore as number;

    home.played += 1;
    away.played += 1;
    home.goalsFor += hs;
    home.goalsAgainst += as;
    away.goalsFor += as;
    away.goalsAgainst += hs;

    if (hs > as) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
      home.form.push('W');
      away.form.push('L');
    } else if (hs < as) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
      home.form.push('L');
      away.form.push('W');
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
      home.form.push('D');
      away.form.push('D');
    }
  }

  // Convert to array and sort
  const standings: TeamStanding[] = teams.map(team => {
    const s = standingsMap.get(team.id)!;
    const gd = s.goalsFor - s.goalsAgainst;
    const recentForm = s.form.slice(-5); // last 5 matches
    return {
      team,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDifference: gd,
      points: s.points,
      form: recentForm,
      rank: 0,
      zone: 'playoff',
    };
  });

  // Sort by Points (desc), Goal Difference (desc), Goals For (desc), Won (desc), Name (asc)
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.won !== a.won) return b.won - a.won;
    return a.team.name.localeCompare(b.team.name);
  });

  // Assign ranks & zones
  standings.forEach((s, idx) => {
    s.rank = idx + 1;
    if (s.rank <= 4) {
      s.zone = 'quarterfinal';
    } else if (s.rank <= 12) {
      s.zone = 'playoff';
    } else {
      s.zone = 'eliminated';
    }
  });

  return standings;
}
