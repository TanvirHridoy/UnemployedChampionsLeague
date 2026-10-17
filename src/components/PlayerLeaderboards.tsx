import React, { useState } from 'react';
import { calculateTournamentStats } from '../utils/statsCalculator';
import { Team, Match } from '../types/tournament';
import { CrestImage } from './CrestImage';
import { 
  Trophy, 
  Target, 
  Sparkles, 
  ShieldAlert, 
  Hand, 
  Search, 
  Medal, 
  Award,
  Crown
} from 'lucide-react';

interface PlayerLeaderboardsProps {
  teams: Team[];
  matches: Match[];
}

export const PlayerLeaderboards: React.FC<PlayerLeaderboardsProps> = ({
  teams,
  matches,
}) => {
  const [activeStatTab, setActiveStatTab] = useState<'scorers' | 'assists' | 'saves' | 'motm' | 'discipline'>('scorers');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const stats = calculateTournamentStats(teams, matches);

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

  const filterList = <T extends { playerName: string; teamId: string }>(list: T[]): T[] => {
    return list.filter(item => {
      const matchesSearch = item.playerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = teamFilter === 'all' || item.teamId === teamFilter;
      return matchesSearch && matchesTeam;
    });
  };

  const filteredScorers = filterList(stats.topScorers);
  const filteredAssists = filterList(stats.topAssists);
  const filteredGoalkeepers = filterList(stats.topGoalkeepers);
  const filteredMotm = filterList(stats.topMotm);
  const filteredDiscipline = filterList(stats.topDiscipline);

  const tabs: { id: typeof activeStatTab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'scorers', label: 'Golden Boot (Goals)', icon: <Target className="w-4 h-4 text-amber-400" />, count: stats.topScorers.length },
    { id: 'assists', label: 'Top Playmakers (Assists)', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, count: stats.topAssists.length },
    { id: 'saves', label: 'Golden Glove (Saves & Clean Sheets)', icon: <Hand className="w-4 h-4 text-emerald-400" />, count: stats.topGoalkeepers.length },
    { id: 'motm', label: 'Star Performers (MOTM)', icon: <Crown className="w-4 h-4 text-yellow-400" />, count: stats.topMotm.length },
    { id: 'discipline', label: 'Disciplinary Records', icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, count: stats.topDiscipline.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Player Individual Leaderboards</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live statistics updated across all 11 matchdays and detailed match event logs.
            </p>
          </div>

          {/* Search & Team Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All 14 Clubs</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab selection */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeStatTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-cyan-300">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* SCORERS TAB */}
        {activeStatTab === 'scorers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-3 text-center">Matches</th>
                  <th className="py-3 px-3 text-center">Penalties</th>
                  <th className="py-3 px-4 text-center font-black text-amber-400 w-20">Goals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredScorers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                      No goalscorers logged yet. Simulate or add match events to see the race for the Golden Boot!
                    </td>
                  </tr>
                ) : (
                  filteredScorers.map((s, idx) => {
                    const team = getTeam(s.teamId);
                    return (
                      <tr key={s.playerId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm">{s.playerName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <CrestImage team={team} size="xs" />
                            <span className="text-slate-300 text-xs font-semibold">{s.teamName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-400 text-xs">
                          {s.matchesPlayed}
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-400 text-xs font-mono">
                          {s.penalties}
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-lg text-amber-400 bg-amber-950/20">
                          {s.goals}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ASSISTS TAB */}
        {activeStatTab === 'assists' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center font-black text-cyan-400 w-24">Assists</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssists.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                      No assists logged yet.
                    </td>
                  </tr>
                ) : (
                  filteredAssists.map((a, idx) => {
                    const team = getTeam(a.teamId);
                    return (
                      <tr key={a.playerId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm">{a.playerName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <CrestImage team={team} size="xs" />
                            <span className="text-slate-300 text-xs font-semibold">{a.teamName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-lg text-cyan-400 bg-cyan-950/20">
                          {a.assists}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GOALKEEPERS TAB */}
        {activeStatTab === 'saves' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Goalkeeper</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center">Clean Sheets</th>
                  <th className="py-3 px-4 text-center">Goals Conceded</th>
                  <th className="py-3 px-4 text-center font-black text-emerald-400 w-24">Saves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredGoalkeepers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                      No goalkeeper data available.
                    </td>
                  </tr>
                ) : (
                  filteredGoalkeepers.map((g, idx) => {
                    const team = getTeam(g.teamId);
                    return (
                      <tr key={g.playerId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm">{g.playerName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <CrestImage team={team} size="xs" />
                            <span className="text-slate-300 text-xs font-semibold">{g.teamName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                          {g.cleanSheets}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-400">
                          {g.goalsConceded}
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-lg text-emerald-400 bg-emerald-950/20">
                          {g.saves}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MOTM TAB */}
        {activeStatTab === 'motm' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center font-black text-yellow-400 w-28">MOTM Awards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMotm.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                      No MOTM awards designated yet. Select Man of the Match in match event logs!
                    </td>
                  </tr>
                ) : (
                  filteredMotm.map((m, idx) => {
                    const team = getTeam(m.teamId);
                    return (
                      <tr key={m.playerId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm">{m.playerName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <CrestImage team={team} size="xs" />
                            <span className="text-slate-300 text-xs font-semibold">{m.teamName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-lg text-yellow-400 bg-yellow-950/20">
                          ★ {m.awards}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* DISCIPLINE TAB */}
        {activeStatTab === 'discipline' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center text-amber-400">🟨 Yellows</th>
                  <th className="py-3 px-4 text-center text-rose-400">🟥 Reds</th>
                  <th className="py-3 px-4 text-center font-black text-rose-300 w-24">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDiscipline.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                      No disciplinary cards logged yet.
                    </td>
                  </tr>
                ) : (
                  filteredDiscipline.map((d, idx) => {
                    const team = getTeam(d.teamId);
                    return (
                      <tr key={d.playerId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm">{d.playerName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <CrestImage team={team} size="xs" />
                            <span className="text-slate-300 text-xs font-semibold">{d.teamName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                          {d.yellowCards}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-rose-400">
                          {d.redCards}
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-rose-300 bg-rose-950/20">
                          {d.points}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
