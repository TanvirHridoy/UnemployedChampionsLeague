import React, { useState } from 'react';
import { TeamStanding, Team, Match } from '../types/tournament';
import { CrestImage } from './CrestImage';
import { Shield, Sparkles, Filter, ChevronRight, UserCheck } from 'lucide-react';

interface StandingsTableProps {
  standings: TeamStanding[];
  onSelectTeam?: (team: Team) => void;
  matches: Match[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onSelectTeam,
  matches,
}) => {
  const [potFilter, setPotFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<TeamStanding | null>(null);

  const filteredStandings = standings.filter(s => {
    if (potFilter === 'all') return true;
    return s.team.pot.toString() === potFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Legend Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>League Phase Standings</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                11 Matchdays • 42 Matches Total
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top 4 advance directly to the Quarterfinals. Teams 5th–12th enter the 2-Leg Knockout Play-offs.
            </p>
          </div>

          {/* Pot Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Pot:
            </span>
            {(['all', '1', '2', '3'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPotFilter(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  potFilter === p
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {p === 'all' ? 'All (14)' : `Pot ${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* Qualification Zones Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Top 4: Direct Quarterfinals (Ranks 1–4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span>Play-offs: 2-Leg Knockout Round (Ranks 5–12)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span>Eliminated: Group Stage Exit (Ranks 13–14)</span>
          </div>
        </div>
      </div>

      {/* Main Standings Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-3 sm:px-4 text-center w-12">Pos</th>
                <th className="py-3 px-3 sm:px-4">Club</th>
                <th className="py-3 px-2 text-center w-14">Pot</th>
                <th className="py-3 px-2 text-center font-semibold w-10 text-slate-300">P</th>
                <th className="py-3 px-2 text-center w-10">W</th>
                <th className="py-3 px-2 text-center w-10">D</th>
                <th className="py-3 px-2 text-center w-10">L</th>
                <th className="py-3 px-2 text-center hidden md:table-cell w-12">GF</th>
                <th className="py-3 px-2 text-center hidden md:table-cell w-12">GA</th>
                <th className="py-3 px-2 text-center font-semibold w-12">GD</th>
                <th className="py-3 px-3 text-center font-extrabold text-cyan-400 w-14">PTS</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell w-36">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStandings.map((standing) => {
                const isTop4 = standing.rank <= 4;
                const isPlayoff = standing.rank >= 5 && standing.rank <= 12;
                const isEliminated = standing.rank >= 13;

                return (
                  <tr
                    key={standing.team.id}
                    onClick={() => setSelectedTeamDetails(standing)}
                    className={`transition-colors duration-150 cursor-pointer hover:bg-slate-800/50 ${
                      isTop4 ? 'bg-emerald-950/10' : isPlayoff ? 'bg-cyan-950/5' : 'bg-slate-900/30'
                    }`}
                  >
                    {/* Position Badge */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shadow-sm ${
                            isTop4
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isPlayoff
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {standing.rank}
                        </span>
                      </div>
                    </td>

                    {/* Team Info */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-3">
                        <CrestImage team={standing.team} size="sm" />
                        <div>
                          <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                            <span>{standing.team.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 hidden sm:block">
                            {standing.team.stadium}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pot Badge */}
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        standing.team.pot === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : standing.team.pot === 2
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        Pot {standing.team.pot}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-2 text-center font-bold text-slate-200">
                      {standing.played}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-300 font-medium">
                      {standing.won}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-400">
                      {standing.drawn}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-400">
                      {standing.lost}
                    </td>
                    <td className="py-3.5 px-2 text-center hidden md:table-cell text-slate-400">
                      {standing.goalsFor}
                    </td>
                    <td className="py-3.5 px-2 text-center hidden md:table-cell text-slate-400">
                      {standing.goalsAgainst}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold">
                      <span className={standing.goalDifference > 0 ? 'text-emerald-400' : standing.goalDifference < 0 ? 'text-rose-400' : 'text-slate-400'}>
                        {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-base text-cyan-400 bg-cyan-950/20">
                      {standing.points}
                    </td>

                    {/* Form Pills */}
                    <td className="py-3.5 px-3 text-center hidden sm:table-cell">
                      {standing.form.length === 0 ? (
                        <span className="text-slate-500 text-xs">—</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {standing.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                                res === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : res === 'D'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Details Modal / Quick View */}
      {selectedTeamDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-800/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTeamDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-5">
              <CrestImage team={selectedTeamDetails.team} size="lg" />
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedTeamDetails.team.name}</span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Pot {selectedTeamDetails.team.pot}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{selectedTeamDetails.team.stadium}</p>
                <div className="mt-1 flex items-center gap-2 text-xs font-semibold">
                  <span className="text-cyan-400">Rank #{selectedTeamDetails.rank}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-white">{selectedTeamDetails.points} PTS</span>
                  <span className="text-slate-500">•</span>
                  <span className={selectedTeamDetails.goalDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    GD {selectedTeamDetails.goalDifference > 0 ? `+${selectedTeamDetails.goalDifference}` : selectedTeamDetails.goalDifference}
                  </span>
                </div>
              </div>
            </div>

            {/* Squad Roster Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Squad Roster ({selectedTeamDetails.team.roster.length} Players)</span>
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-800 rounded-xl p-2 bg-slate-950/60">
                {selectedTeamDetails.team.roster.map(player => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-right font-mono font-bold text-slate-400">
                        #{player.number}
                      </span>
                      <span className="font-semibold text-slate-200">{player.name}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      player.position === 'GK'
                        ? 'bg-amber-500/20 text-amber-300'
                        : player.position === 'DEF'
                        ? 'bg-blue-500/20 text-blue-300'
                        : player.position === 'MID'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {player.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedTeamDetails(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
