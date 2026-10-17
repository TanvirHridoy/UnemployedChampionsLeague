import React, { useState } from 'react';
import { Match, Team, MatchStatus } from '../types/tournament';
import { CrestImage } from './CrestImage';
import { MatchEventModal } from './MatchEventModal';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Trophy, 
  Edit3, 
  Check, 
  RotateCcw,
  Clock,
  Radio
} from 'lucide-react';
import { simulateSingleMatch, simulateMatchday } from '../utils/matchSimulator';

interface FixturesManagerProps {
  matches: Match[];
  teams: Team[];
  onUpdateMatch: (updatedMatch: Match) => void;
  onUpdateMatches: (updatedMatches: Match[]) => void;
}

export const FixturesManager: React.FC<FixturesManagerProps> = ({
  matches,
  teams,
  onUpdateMatch,
  onUpdateMatches,
}) => {
  const [selectedMatchday, setSelectedMatchday] = useState<number | 'all'>(1);
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const matchdays = Array.from({ length: 11 }, (_, i) => i + 1);

  const filteredMatches = matches.filter(m => {
    if (selectedMatchday !== 'all' && m.matchday !== selectedMatchday) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  const handleQuickScoreChange = (match: Match, homeScoreStr: string, awayScoreStr: string) => {
    const hs = homeScoreStr === '' ? null : Math.max(0, parseInt(homeScoreStr) || 0);
    const as = awayScoreStr === '' ? null : Math.max(0, parseInt(awayScoreStr) || 0);
    const isCompleted = hs !== null && as !== null;

    onUpdateMatch({
      ...match,
      homeScore: hs,
      awayScore: as,
      status: isCompleted ? 'completed' : 'scheduled',
    });
  };

  const handleSimulateCurrentMatchday = () => {
    if (selectedMatchday === 'all') return;
    const updated = simulateMatchday(selectedMatchday, matches, teams);
    onUpdateMatches(updated);
  };

  const handleSimulateMatch = (match: Match) => {
    const updated = simulateSingleMatch(match, teams);
    onUpdateMatch(updated);
  };

  const handleResetMatch = (match: Match) => {
    onUpdateMatch({
      ...match,
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      motmPlayerId: undefined,
      events: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Matchday Tabs Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Fixtures & Results Schedule</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any matchday to view, log real-time match events, or simulate realistic UCL outcomes.
            </p>
          </div>

          {/* Simulate Matchday Action */}
          {selectedMatchday !== 'all' && (
            <button
              onClick={handleSimulateCurrentMatchday}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all self-start lg:self-auto active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Simulate Matchday {selectedMatchday}</span>
            </button>
          )}
        </div>

        {/* Matchday Selector Pills */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedMatchday('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedMatchday === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 11 Days
          </button>
          {matchdays.map((day) => {
            const dayMatches = matches.filter(m => m.matchday === day);
            const completedCount = dayMatches.filter(m => m.status === 'completed').length;
            const isAllCompleted = completedCount === dayMatches.length;

            return (
              <button
                key={day}
                onClick={() => setSelectedMatchday(day)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedMatchday === day
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>Day {day}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isAllCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {completedCount}/{dayMatches.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold">
          Showing {filteredMatches.length} matches
        </span>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {(['all', 'completed', 'scheduled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => {
          const homeTeam = teams.find(t => t.id === match.homeTeamId);
          const awayTeam = teams.find(t => t.id === match.awayTeamId);
          const isCompleted = match.status === 'completed';
          const isLive = match.status === 'live';

          const motmPlayer = match.motmPlayerId
            ? homeTeam?.roster.find(p => p.id === match.motmPlayerId) ||
              awayTeam?.roster.find(p => p.id === match.motmPlayerId)
            : null;

          const goalEvents = match.events.filter(e => e.type === 'goal');

          return (
            <div
              key={match.id}
              className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 hover:border-cyan-700/60 flex flex-col justify-between ${
                isCompleted
                  ? 'border-slate-800/90'
                  : isLive
                  ? 'border-rose-700/60 bg-rose-950/10'
                  : 'border-slate-800/60'
              }`}
            >
              {/* Card Header: Matchday, Stadium, Status Badge */}
              <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-black text-[11px] bg-slate-950 text-cyan-400 border border-slate-800">
                    Day {match.matchday}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 line-clamp-1 max-w-[160px] sm:max-w-[220px]">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{match.venue || homeTeam?.stadium}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isLive
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {match.status}
                  </span>
                </div>
              </div>

              {/* Main Score & Teams Arena */}
              <div className="grid grid-cols-7 items-center gap-2 py-2">
                {/* Home Club */}
                <div className="col-span-3 flex items-center gap-3">
                  <CrestImage team={homeTeam} size="md" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {homeTeam?.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      Pot {homeTeam?.pot}
                    </span>
                  </div>
                </div>

                {/* Score inputs or display */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={match.homeScore ?? ''}
                      onChange={(e) => handleQuickScoreChange(match, e.target.value, match.awayScore !== null ? String(match.awayScore) : '')}
                      className="w-8 h-9 text-center font-black text-lg bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs font-bold text-slate-500">:</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={match.awayScore ?? ''}
                      onChange={(e) => handleQuickScoreChange(match, match.homeScore !== null ? String(match.homeScore) : '', e.target.value)}
                      className="w-8 h-9 text-center font-black text-lg bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Away Club */}
                <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {awayTeam?.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      Pot {awayTeam?.pot}
                    </span>
                  </div>
                  <CrestImage team={awayTeam} size="md" />
                </div>
              </div>

              {/* Goalscorers & Event Highlights summary */}
              {goalEvents.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-300 space-y-1">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {goalEvents.map((g) => (
                      <span key={g.id} className="flex items-center gap-1">
                        <span>⚽</span>
                        <span className="font-semibold text-white">{g.playerName}</span>
                        <span className="text-slate-400 font-mono">{g.minute}'</span>
                        {g.isPenalty && <span className="text-amber-400 text-[10px]">(P)</span>}
                        {g.isOwnGoal && <span className="text-rose-400 text-[10px]">(OG)</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* MOTM Pill */}
              {motmPlayer && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 self-start">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>MOTM: {motmPlayer.name}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingMatch(match)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Match Events ({match.events.length})</span>
                  </button>

                  <button
                    onClick={() => handleSimulateMatch(match)}
                    title="Simulate realistic scoreline, scorers, saves, and MOTM"
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Sim</span>
                  </button>
                </div>

                {isCompleted && (
                  <button
                    onClick={() => handleResetMatch(match)}
                    title="Reset match result back to scheduled"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Match Events Modal */}
      {editingMatch && (
        <MatchEventModal
          match={editingMatch}
          teams={teams}
          onSave={(updated) => {
            onUpdateMatch(updated);
            setEditingMatch(null);
          }}
          onClose={() => setEditingMatch(null)}
        />
      )}
    </div>
  );
};
