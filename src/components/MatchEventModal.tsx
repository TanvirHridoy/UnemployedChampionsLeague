import React, { useState } from 'react';
import { Match, Team, MatchEvent, MatchEventType, MatchStatus } from '../types/tournament';
import { CrestImage } from './CrestImage';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  User, 
  AlertTriangle 
} from 'lucide-react';

interface MatchEventModalProps {
  match: Match;
  teams: Team[];
  onSave: (updatedMatch: Match) => void;
  onClose: () => void;
}

export const MatchEventModal: React.FC<MatchEventModalProps> = ({
  match,
  teams,
  onSave,
  onClose,
}) => {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [homeScore, setHomeScore] = useState<number>(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState<number>(match.awayScore ?? 0);
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [motmPlayerId, setMotmPlayerId] = useState<string>(match.motmPlayerId || '');
  const [events, setEvents] = useState<MatchEvent[]>([...match.events]);

  // Form states for adding a new event
  const [newEventType, setNewEventType] = useState<MatchEventType>('goal');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(match.homeTeamId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [eventMinute, setEventMinute] = useState<number>(45);
  const [assistPlayerId, setAssistPlayerId] = useState<string>('');
  const [isPenalty, setIsPenalty] = useState<boolean>(false);
  const [isOwnGoal, setIsOwnGoal] = useState<boolean>(false);
  const [savesCount, setSavesCount] = useState<number>(3);

  const currentTeam = selectedTeamId === match.homeTeamId ? homeTeam : awayTeam;
  const currentRoster = currentTeam?.roster || [];

  // When team changes, set default player
  React.useEffect(() => {
    if (currentRoster.length > 0 && (!selectedPlayerId || !currentRoster.find(p => p.id === selectedPlayerId))) {
      if (newEventType === 'save') {
        const gk = currentRoster.find(p => p.position === 'GK') || currentRoster[0];
        setSelectedPlayerId(gk.id);
      } else {
        setSelectedPlayerId(currentRoster[0].id);
      }
    }
  }, [selectedTeamId, newEventType]);

  const handleAddEvent = () => {
    if (!selectedPlayerId) return;
    const player = currentRoster.find(p => p.id === selectedPlayerId);
    if (!player) return;

    const assister = currentRoster.find(p => p.id === assistPlayerId);

    const newEv: MatchEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      matchId: match.id,
      type: newEventType,
      minute: eventMinute,
      playerId: player.id,
      playerName: player.name,
      teamId: selectedTeamId,
      assistPlayerId: assister?.id,
      assistPlayerName: assister?.name,
      isPenalty: newEventType === 'goal' ? isPenalty : false,
      isOwnGoal: newEventType === 'goal' ? isOwnGoal : false,
      detail: newEventType === 'save' ? `${savesCount} saves` : undefined,
    };

    const updated = [...events, newEv].sort((a, b) => a.minute - b.minute);
    setEvents(updated);

    // Auto-update score if goal added
    if (newEventType === 'goal') {
      if (isOwnGoal) {
        // Own goal goes to other team
        if (selectedTeamId === match.homeTeamId) {
          setAwayScore(prev => prev + 1);
        } else {
          setHomeScore(prev => prev + 1);
        }
      } else {
        if (selectedTeamId === match.homeTeamId) {
          setHomeScore(prev => prev + 1);
        } else {
          setAwayScore(prev => prev + 1);
        }
      }
      setStatus('completed');
    }

    // Reset inputs
    setAssistPlayerId('');
    setIsPenalty(false);
    setIsOwnGoal(false);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSyncScoreFromGoals = () => {
    let h = 0;
    let a = 0;
    for (const ev of events) {
      if (ev.type === 'goal') {
        if (ev.isOwnGoal) {
          if (ev.teamId === match.homeTeamId) a += 1;
          else h += 1;
        } else {
          if (ev.teamId === match.homeTeamId) h += 1;
          else a += 1;
        }
      }
    }
    setHomeScore(h);
    setAwayScore(a);
  };

  const handleSave = () => {
    const updatedMatch: Match = {
      ...match,
      homeScore: status === 'scheduled' && homeScore === 0 && awayScore === 0 && events.length === 0 ? null : homeScore,
      awayScore: status === 'scheduled' && homeScore === 0 && awayScore === 0 && events.length === 0 ? null : awayScore,
      status,
      motmPlayerId: motmPlayerId || undefined,
      events,
    };
    onSave(updatedMatch);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-800/50 rounded-2xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Matchday {match.matchday} • Match Details & Events
            </span>
            <h3 className="text-lg font-extrabold text-white">
              {homeTeam?.name} vs {awayTeam?.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Scoreboard Editor */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <div className="grid grid-cols-7 items-center w-full max-w-md gap-2">
              {/* Home Team */}
              <div className="col-span-3 flex flex-col items-center text-center">
                <CrestImage team={homeTeam} size="md" />
                <span className="font-bold text-white text-sm mt-1.5 line-clamp-1">{homeTeam?.name}</span>
                <span className="text-[10px] text-cyan-400">Home</span>
              </div>

              {/* Score Input Box */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={homeScore}
                    onChange={(e) => {
                      setHomeScore(Math.max(0, parseInt(e.target.value) || 0));
                      if (status === 'scheduled') setStatus('completed');
                    }}
                    className="w-12 h-12 text-center text-2xl font-black bg-slate-900 border border-cyan-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-xl font-bold text-slate-500">:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={awayScore}
                    onChange={(e) => {
                      setAwayScore(Math.max(0, parseInt(e.target.value) || 0));
                      if (status === 'scheduled') setStatus('completed');
                    }}
                    className="w-12 h-12 text-center text-2xl font-black bg-slate-900 border border-cyan-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Away Team */}
              <div className="col-span-3 flex flex-col items-center text-center">
                <CrestImage team={awayTeam} size="md" />
                <span className="font-bold text-white text-sm mt-1.5 line-clamp-1">{awayTeam?.name}</span>
                <span className="text-[10px] text-indigo-400">Away</span>
              </div>
            </div>

            {/* Match Status Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Match Status:</span>
              {(['scheduled', 'live', 'completed'] as MatchStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                    status === st
                      ? st === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : st === 'live'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Sync score button */}
            {events.filter(e => e.type === 'goal').length > 0 && (
              <button
                type="button"
                onClick={handleSyncScoreFromGoals}
                className="mt-3 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Auto-sync score from logged goal events
              </button>
            )}
          </div>

          {/* Man of the Match (MOTM) Selection */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Man of the Match (MOTM)</span>
            </label>
            <select
              value={motmPlayerId}
              onChange={(e) => setMotmPlayerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Select MOTM Player (Optional)</option>
              <optgroup label={`${homeTeam?.name} (Home)`}>
                {homeTeam?.roster.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.number} {p.name} ({p.position})
                  </option>
                ))}
              </optgroup>
              <optgroup label={`${awayTeam?.name} (Away)`}>
                {awayTeam?.roster.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.number} {p.name} ({p.position})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Add Match Event Sub-Form */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Record Match Event (Goals, Assists, Saves, Cards)</span>
            </h4>

            {/* Event Type & Team Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Event Type */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Event Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as MatchEventType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="goal">⚽ Goal</option>
                  <option value="assist">👟 Assist</option>
                  <option value="save">🧤 Goalkeeper Save</option>
                  <option value="yellow_card">🟨 Yellow Card</option>
                  <option value="red_card">🟥 Red Card</option>
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Team</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={homeTeam?.id}>{homeTeam?.name} (Home)</option>
                  <option value={awayTeam?.id}>{awayTeam?.name} (Away)</option>
                </select>
              </div>

              {/* Minute */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Minute</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={eventMinute}
                  onChange={(e) => setEventMinute(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Player Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  {newEventType === 'save' ? 'Goalkeeper' : 'Player'}
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {currentRoster.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional: Assist dropdown if Goal */}
              {newEventType === 'goal' && (
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Assist By (Optional)</label>
                  <select
                    value={assistPlayerId}
                    onChange={(e) => setAssistPlayerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="">No Assist / Solo Effort</option>
                    {currentRoster
                      .filter(p => p.id !== selectedPlayerId)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Conditional: Save Count if Save */}
              {newEventType === 'save' && (
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Saves Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={savesCount}
                    onChange={(e) => setSavesCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Checkboxes for Penalty / Own Goal */}
            {newEventType === 'goal' && (
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPenalty}
                    onChange={(e) => setIsPenalty(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Penalty Goal (P)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOwnGoal}
                    onChange={(e) => setIsOwnGoal(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <span>Own Goal (OG)</span>
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddEvent}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-[0.99]"
            >
              + Add Event to Match Timeline
            </button>
          </div>

          {/* Timeline of Recorded Events */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Match Timeline ({events.length} Events)</span>
            </h4>

            {events.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No events recorded yet. Add goals, saves, or cards above.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {events.map((ev) => {
                  const evTeam = teams.find(t => t.id === ev.teamId);
                  const isHome = ev.teamId === match.homeTeamId;

                  return (
                    <div
                      key={ev.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                        isHome
                          ? 'bg-blue-950/20 border-blue-900/40 text-blue-200'
                          : 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[11px] border border-slate-800">
                          {ev.minute}'
                        </span>
                        <span>
                          {ev.type === 'goal' && '⚽'}
                          {ev.type === 'assist' && '👟'}
                          {ev.type === 'save' && '🧤'}
                          {ev.type === 'yellow_card' && '🟨'}
                          {ev.type === 'red_card' && '🟥'}
                        </span>
                        <span className="font-bold text-white">{ev.playerName}</span>
                        {ev.isPenalty && <span className="text-[10px] text-amber-300 font-bold">(PEN)</span>}
                        {ev.isOwnGoal && <span className="text-[10px] text-rose-300 font-bold">(OG)</span>}
                        {ev.assistPlayerName && (
                          <span className="text-slate-400 text-[11px]">
                            ast: {ev.assistPlayerName}
                          </span>
                        )}
                        {ev.detail && (
                          <span className="text-slate-400 text-[11px]">
                            ({ev.detail})
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          • {evTeam?.shortName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(ev.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all"
          >
            Save Matchline & Events
          </button>
        </div>
      </div>
    </div>
  );
};
