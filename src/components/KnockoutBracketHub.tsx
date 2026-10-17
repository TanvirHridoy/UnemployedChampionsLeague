import React, { useState } from 'react';
import { KnockoutTie, GrandFinal, Team, TeamStanding } from '../types/tournament';
import { CrestImage } from './CrestImage';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  GitBranch, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';

interface KnockoutBracketHubProps {
  knockoutTies: KnockoutTie[];
  grandFinal: GrandFinal;
  teams: Team[];
  standings: TeamStanding[];
  onUpdateTie: (tie: KnockoutTie) => void;
  onUpdateGrandFinal: (gf: GrandFinal) => void;
  onResetKnockout: () => void;
}

export const KnockoutBracketHub: React.FC<KnockoutBracketHubProps> = ({
  knockoutTies,
  grandFinal,
  teams,
  standings,
  onUpdateTie,
  onUpdateGrandFinal,
  onResetKnockout,
}) => {
  const [activeStageTab, setActiveStageTab] = useState<'all' | 'playoff' | 'quarterfinal' | 'semifinal' | 'final'>('all');

  const playoffTies = knockoutTies.filter(t => t.stage === 'playoff');
  const qfTies = knockoutTies.filter(t => t.stage === 'quarterfinal');
  const sfTies = knockoutTies.filter(t => t.stage === 'semifinal');

  const getTeam = (id?: string | null) => id ? teams.find(t => t.id === id) : undefined;

  // Sync teams into bracket from current Standings
  const handleSyncSeedsFromStandings = () => {
    // Top 4 go to QFs
    const top4 = standings.slice(0, 4);
    // 5th to 12th go to Play-offs (ranks 5 to 12)
    const playoffTeams = standings.slice(4, 12);

    if (standings.length < 12) return;

    // Update Play-off ties:
    // PO 1: 5th vs 12th
    // PO 2: 6th vs 11th
    // PO 3: 7th vs 10th
    // PO 4: 8th vs 9th
    const pairs = [
      { tieNum: 1, teamA: playoffTeams[0]?.team.id, teamB: playoffTeams[7]?.team.id }, // 5th vs 12th
      { tieNum: 2, teamA: playoffTeams[1]?.team.id, teamB: playoffTeams[6]?.team.id }, // 6th vs 11th
      { tieNum: 3, teamA: playoffTeams[2]?.team.id, teamB: playoffTeams[5]?.team.id }, // 7th vs 10th
      { tieNum: 4, teamA: playoffTeams[3]?.team.id, teamB: playoffTeams[4]?.team.id }, // 8th vs 9th
    ];

    for (const p of pairs) {
      const tie = playoffTies.find(t => t.tieNumber === p.tieNum);
      if (tie) {
        onUpdateTie({
          ...tie,
          teamAId: p.teamA || null,
          teamBId: p.teamB || null,
        });
      }
    }

    // Top 4 placed in QF ties
    const qfPlacements = [
      { tieNum: 1, teamA: top4[0]?.team.id }, // 1st
      { tieNum: 2, teamA: top4[1]?.team.id }, // 2nd
      { tieNum: 3, teamA: top4[2]?.team.id }, // 3rd
      { tieNum: 4, teamA: top4[3]?.team.id }, // 4th
    ];

    for (const q of qfPlacements) {
      const tie = qfTies.find(t => t.tieNumber === q.tieNum);
      if (tie) {
        onUpdateTie({
          ...tie,
          teamAId: q.teamA || null,
        });
      }
    }
  };

  // Helper to calculate aggregate and determine winner of a 2-leg tie
  const handleScoreChange = (
    tie: KnockoutTie,
    legNum: 1 | 2,
    field: 'home' | 'away',
    val: string
  ) => {
    const num = val === '' ? null : Math.max(0, parseInt(val) || 0);

    const updated = { ...tie };
    if (legNum === 1) {
      updated.leg1 = {
        ...updated.leg1,
        [field === 'home' ? 'homeScore' : 'awayScore']: num,
        status: (field === 'home' ? num : updated.leg1.homeScore) !== null && 
                (field === 'away' ? num : updated.leg1.awayScore) !== null ? 'completed' : 'scheduled',
      };
    } else {
      updated.leg2 = {
        ...updated.leg2,
        [field === 'home' ? 'homeScore' : 'awayScore']: num,
        status: (field === 'home' ? num : updated.leg2.homeScore) !== null && 
                (field === 'away' ? num : updated.leg2.awayScore) !== null ? 'completed' : 'scheduled',
      };
    }

    // Compute aggregate
    // In Leg 1: Team B is Home, Team A is Away
    // In Leg 2: Team A is Home, Team B is Away
    const bHomeLeg1 = updated.leg1.homeScore ?? 0;
    const aAwayLeg1 = updated.leg1.awayScore ?? 0;
    const aHomeLeg2 = updated.leg2.homeScore ?? 0;
    const bAwayLeg2 = updated.leg2.awayScore ?? 0;

    const bothLegsPlayed = updated.leg1.homeScore !== null && updated.leg1.awayScore !== null &&
                           updated.leg2.homeScore !== null && updated.leg2.awayScore !== null;

    if (bothLegsPlayed) {
      const totalA = aAwayLeg1 + aHomeLeg2;
      const totalB = bHomeLeg1 + bAwayLeg2;

      if (totalA > totalB) {
        updated.winnerTeamId = updated.teamAId;
      } else if (totalB > totalA) {
        updated.winnerTeamId = updated.teamBId;
      } else {
        // Tied aggregate: check penalty scores if present
        if (updated.penaltiesA !== null && updated.penaltiesA !== undefined &&
            updated.penaltiesB !== null && updated.penaltiesB !== undefined) {
          if (updated.penaltiesA > updated.penaltiesB) updated.winnerTeamId = updated.teamAId;
          else if (updated.penaltiesB > updated.penaltiesA) updated.winnerTeamId = updated.teamBId;
        }
      }
    }

    onUpdateTie(updated);

    // If Playoff winner determined, auto advance to QF
    if (updated.stage === 'playoff' && updated.winnerTeamId) {
      // PO 1 winner goes to QF 4 team B
      // PO 2 winner goes to QF 3 team B
      // PO 3 winner goes to QF 2 team B
      // PO 4 winner goes to QF 1 team B
      const targetQfMap: Record<number, number> = { 1: 4, 2: 3, 3: 2, 4: 1 };
      const targetQfNum = targetQfMap[updated.tieNumber];
      const targetQf = qfTies.find(t => t.tieNumber === targetQfNum);
      if (targetQf) {
        onUpdateTie({
          ...targetQf,
          teamBId: updated.winnerTeamId,
        });
      }
    }

    // If QF winner determined, auto advance to SF
    if (updated.stage === 'quarterfinal' && updated.winnerTeamId) {
      // QF 1 & QF 4 -> SF 1
      // QF 2 & QF 3 -> SF 2
      if (updated.tieNumber === 1 || updated.tieNumber === 4) {
        const sf1 = sfTies.find(t => t.tieNumber === 1);
        if (sf1) {
          onUpdateTie({
            ...sf1,
            [updated.tieNumber === 1 ? 'teamAId' : 'teamBId']: updated.winnerTeamId,
          });
        }
      } else if (updated.tieNumber === 2 || updated.tieNumber === 3) {
        const sf2 = sfTies.find(t => t.tieNumber === 2);
        if (sf2) {
          onUpdateTie({
            ...sf2,
            [updated.tieNumber === 2 ? 'teamAId' : 'teamBId']: updated.winnerTeamId,
          });
        }
      }
    }

    // If SF winner determined, auto advance to Grand Final
    if (updated.stage === 'semifinal' && updated.winnerTeamId) {
      onUpdateGrandFinal({
        ...grandFinal,
        [updated.tieNumber === 1 ? 'teamAId' : 'teamBId']: updated.winnerTeamId,
      });
    }
  };

  const handlePenaltyChange = (tie: KnockoutTie, team: 'A' | 'B', val: string) => {
    const pen = val === '' ? null : Math.max(0, parseInt(val) || 0);
    const updated = {
      ...tie,
      [team === 'A' ? 'penaltiesA' : 'penaltiesB']: pen,
    };

    const penA = team === 'A' ? pen : tie.penaltiesA;
    const penB = team === 'B' ? pen : tie.penaltiesB;

    if (penA !== null && penA !== undefined && penB !== null && penB !== undefined) {
      if (penA > penB) updated.winnerTeamId = tie.teamAId;
      else if (penB > penA) updated.winnerTeamId = tie.teamBId;
    }
    onUpdateTie(updated);
  };

  // Grand Final Handlers
  const handleFinalScoreChange = (team: 'A' | 'B', val: string) => {
    const sc = val === '' ? null : Math.max(0, parseInt(val) || 0);
    const regHome = team === 'A' ? sc : grandFinal.regularHomeScore;
    const regAway = team === 'B' ? sc : grandFinal.regularAwayScore;

    let winner: string | null = null;
    let isCompleted = regHome !== null && regAway !== null;

    if (isCompleted) {
      if ((regHome as number) > (regAway as number)) {
        winner = grandFinal.teamAId;
      } else if ((regAway as number) > (regHome as number)) {
        winner = grandFinal.teamBId;
      }
    }

    const updated: GrandFinal = {
      ...grandFinal,
      regularHomeScore: regHome,
      regularAwayScore: regAway,
      status: isCompleted ? 'completed' : 'scheduled',
      winnerTeamId: winner,
    };

    onUpdateGrandFinal(updated);

    if (winner) {
      triggerConfetti();
    }
  };

  const handleFinalPenaltyChange = (team: 'A' | 'B', val: string) => {
    const pen = val === '' ? null : Math.max(0, parseInt(val) || 0);
    const penA = team === 'A' ? pen : grandFinal.penaltiesA;
    const penB = team === 'B' ? pen : grandFinal.penaltiesB;

    let winner = grandFinal.winnerTeamId;
    if (penA !== null && penA !== undefined && penB !== null && penB !== undefined) {
      if (penA > penB) winner = grandFinal.teamAId;
      else if (penB > penA) winner = grandFinal.teamBId;
    }

    const updated: GrandFinal = {
      ...grandFinal,
      penaltiesA: penA,
      penaltiesB: penB,
      winnerTeamId: winner,
    };
    onUpdateGrandFinal(updated);

    if (winner) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#f59e0b', '#3b82f6', '#ffffff', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  };

  const championTeam = getTeam(grandFinal.winnerTeamId);

  // Render a 2-leg tie card
  const renderTieCard = (tie: KnockoutTie) => {
    const teamA = getTeam(tie.teamAId); // Higher seed
    const teamB = getTeam(tie.teamBId); // Lower seed

    const bHomeLeg1 = tie.leg1.homeScore;
    const aAwayLeg1 = tie.leg1.awayScore;
    const aHomeLeg2 = tie.leg2.homeScore;
    const bAwayLeg2 = tie.leg2.awayScore;

    const hasLeg1 = bHomeLeg1 !== null && aAwayLeg1 !== null;
    const hasLeg2 = aHomeLeg2 !== null && bAwayLeg2 !== null;

    const totalA = (aAwayLeg1 ?? 0) + (aHomeLeg2 ?? 0);
    const totalB = (bHomeLeg1 ?? 0) + (bAwayLeg2 ?? 0);
    const isTiedAggregate = hasLeg1 && hasLeg2 && totalA === totalB;

    const isWinnerA = tie.winnerTeamId && tie.winnerTeamId === tie.teamAId;
    const isWinnerB = tie.winnerTeamId && tie.winnerTeamId === tie.teamBId;

    return (
      <div
        key={tie.id}
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between hover:border-cyan-800/60 transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 text-xs">
          <span className="font-bold text-cyan-400">{tie.name}</span>
          <span className="text-[11px] font-semibold text-slate-400">2 Legs Aggregate</span>
        </div>

        {/* Teams & Aggregate Board */}
        <div className="space-y-3">
          {/* Team A (Higher seed) */}
          <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
            isWinnerA
              ? 'bg-emerald-950/30 border-emerald-500/60 text-white shadow-sm'
              : 'bg-slate-950/60 border-slate-800/70 text-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <CrestImage team={teamA} size="sm" />
              <div>
                <span className="font-bold text-sm block leading-tight">
                  {teamA ? teamA.name : <span className="text-slate-500 italic">To be determined</span>}
                </span>
                {teamA && <span className="text-[10px] text-slate-400">Pot {teamA.pot}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasLeg1 && hasLeg2 && (
                <div className="text-right">
                  <span className={`text-base font-black px-2 py-0.5 rounded ${
                    isWinnerA ? 'text-emerald-400 bg-emerald-950' : 'text-slate-300'
                  }`}>
                    Agg: {totalA}
                  </span>
                  {tie.penaltiesA !== null && tie.penaltiesA !== undefined && (
                    <span className="text-[10px] block text-amber-300 font-mono">
                      ({tie.penaltiesA} pen)
                    </span>
                  )}
                </div>
              )}
              {isWinnerA && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          </div>

          {/* Team B (Lower seed) */}
          <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
            isWinnerB
              ? 'bg-emerald-950/30 border-emerald-500/60 text-white shadow-sm'
              : 'bg-slate-950/60 border-slate-800/70 text-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <CrestImage team={teamB} size="sm" />
              <div>
                <span className="font-bold text-sm block leading-tight">
                  {teamB ? teamB.name : <span className="text-slate-500 italic">To be determined</span>}
                </span>
                {teamB && <span className="text-[10px] text-slate-400">Pot {teamB.pot}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasLeg1 && hasLeg2 && (
                <div className="text-right">
                  <span className={`text-base font-black px-2 py-0.5 rounded ${
                    isWinnerB ? 'text-emerald-400 bg-emerald-950' : 'text-slate-300'
                  }`}>
                    Agg: {totalB}
                  </span>
                  {tie.penaltiesB !== null && tie.penaltiesB !== undefined && (
                    <span className="text-[10px] block text-amber-300 font-mono">
                      ({tie.penaltiesB} pen)
                    </span>
                  )}
                </div>
              )}
              {isWinnerB && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          </div>
        </div>

        {/* 2-Legs Score Inputs Table */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
          {/* Leg 1: Team B Home vs Team A Away */}
          <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-400 font-medium">Leg 1 ({teamB?.shortName || 'B'} Home):</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                placeholder="—"
                value={tie.leg1.homeScore ?? ''}
                onChange={(e) => handleScoreChange(tie, 1, 'home', e.target.value)}
                className="w-8 h-7 text-center font-bold bg-slate-900 border border-slate-700 rounded text-white text-xs"
              />
              <span className="text-slate-500 font-bold">:</span>
              <input
                type="number"
                min="0"
                placeholder="—"
                value={tie.leg1.awayScore ?? ''}
                onChange={(e) => handleScoreChange(tie, 1, 'away', e.target.value)}
                className="w-8 h-7 text-center font-bold bg-slate-900 border border-slate-700 rounded text-white text-xs"
              />
            </div>
          </div>

          {/* Leg 2: Team A Home vs Team B Away */}
          <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-400 font-medium">Leg 2 ({teamA?.shortName || 'A'} Home):</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                placeholder="—"
                value={tie.leg2.homeScore ?? ''}
                onChange={(e) => handleScoreChange(tie, 2, 'home', e.target.value)}
                className="w-8 h-7 text-center font-bold bg-slate-900 border border-slate-700 rounded text-white text-xs"
              />
              <span className="text-slate-500 font-bold">:</span>
              <input
                type="number"
                min="0"
                placeholder="—"
                value={tie.leg2.awayScore ?? ''}
                onChange={(e) => handleScoreChange(tie, 2, 'away', e.target.value)}
                className="w-8 h-7 text-center font-bold bg-slate-900 border border-slate-700 rounded text-white text-xs"
              />
            </div>
          </div>

          {/* Penalties if aggregate tied */}
          {isTiedAggregate && (
            <div className="flex items-center justify-between bg-amber-950/30 p-2 rounded-lg border border-amber-600/40 text-amber-300">
              <span className="font-semibold text-[11px]">Shootout (Penalties):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="A"
                  value={tie.penaltiesA ?? ''}
                  onChange={(e) => handlePenaltyChange(tie, 'A', e.target.value)}
                  className="w-8 h-7 text-center font-bold bg-slate-900 border border-amber-600/60 rounded text-amber-200 text-xs"
                />
                <span className="text-amber-500 font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  placeholder="B"
                  value={tie.penaltiesB ?? ''}
                  onChange={(e) => handlePenaltyChange(tie, 'B', e.target.value)}
                  className="w-8 h-7 text-center font-bold bg-slate-900 border border-amber-600/60 rounded text-amber-200 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Automatic Seeding Action */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <span>2-Leg Knockout Stage Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Play-offs (5th–12th) &amp; Direct Quarterfinals (1st–4th) • Home &amp; Away aggregate calculations • Grand Final crown.
            </p>
          </div>

          {/* Sync Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncSeedsFromStandings}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Sync Seeds From Standings</span>
            </button>

            <button
              onClick={onResetKnockout}
              title="Reset bracket back to empty"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Filter Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(['all', 'playoff', 'quarterfinal', 'semifinal', 'final'] as const).map(stage => (
            <button
              key={stage}
              onClick={() => setActiveStageTab(stage)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeStageTab === stage
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {stage === 'all' ? 'All Stages' : stage === 'playoff' ? 'Play-offs' : stage === 'quarterfinal' ? 'Quarterfinals' : stage === 'semifinal' ? 'Semifinals' : 'Grand Final'}
            </button>
          ))}
        </div>
      </div>

      {/* Champion Crowning Hero Card (If Final Winner Exists) */}
      {championTeam && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/60 via-slate-900 to-indigo-950 border-2 border-amber-500/60 p-6 sm:p-8 text-center shadow-[0_0_35px_rgba(245,158,11,0.25)]">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]">
              <Crown className="w-9 h-9 text-amber-300 animate-bounce" />
            </div>

            <div className="text-amber-400 font-extrabold uppercase tracking-widest text-xs">
              UCL Season 3 Champions
            </div>

            <div className="flex items-center gap-4">
              <CrestImage team={championTeam} size="lg" />
              <h3 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-wide">
                {championTeam.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Congratulations to {championTeam.name} for conquering the Unemployed Champions League Season 3!
            </p>

            <button
              onClick={triggerConfetti}
              className="mt-2 px-4 py-1.5 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all active:scale-95"
            >
              🎉 Celebrate Again!
            </button>
          </div>
        </div>
      )}

      {/* Stage Sections */}
      <div className="space-y-8">
        
        {/* Play-offs Section */}
        {(activeStageTab === 'all' || activeStageTab === 'playoff') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Knockout Play-offs (5th vs 12th, 6th vs 11th, 7th vs 10th, 8th vs 9th)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">4 Ties • 2 Legs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {playoffTies.map(renderTieCard)}
            </div>
          </div>
        )}

        {/* Quarterfinals Section */}
        {(activeStageTab === 'all' || activeStageTab === 'quarterfinal') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Quarterfinals (Top 4 Direct Seeds vs Play-off Winners)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">4 Ties • 2 Legs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {qfTies.map(renderTieCard)}
            </div>
          </div>
        )}

        {/* Semifinals Section */}
        {(activeStageTab === 'all' || activeStageTab === 'semifinal') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>Semifinals</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">2 Ties • 2 Legs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sfTies.map(renderTieCard)}
            </div>
          </div>
        )}

        {/* Grand Final Section */}
        {(activeStageTab === 'all' || activeStageTab === 'final') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Grand Final (Single Match • Neutral Venue: {grandFinal.venue})</span>
              </h3>
              <span className="text-xs text-amber-400 font-bold">Trophy Match</span>
            </div>

            <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-7 items-center gap-4 max-w-2xl mx-auto">
                {/* Finalist A */}
                <div className="col-span-3 flex flex-col items-center text-center">
                  <CrestImage team={getTeam(grandFinal.teamAId)} size="lg" />
                  <span className="font-extrabold text-white text-base mt-2">
                    {getTeam(grandFinal.teamAId)?.name || 'SF 1 Winner'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Finalist 1</span>
                </div>

                {/* Score Input */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="—"
                      value={grandFinal.regularHomeScore ?? ''}
                      onChange={(e) => handleFinalScoreChange('A', e.target.value)}
                      className="w-12 h-12 text-center text-2xl font-black bg-slate-950 border border-amber-500/50 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xl font-bold text-slate-500">:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="—"
                      value={grandFinal.regularAwayScore ?? ''}
                      onChange={(e) => handleFinalScoreChange('B', e.target.value)}
                      className="w-12 h-12 text-center text-2xl font-black bg-slate-950 border border-amber-500/50 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Shootout if tied */}
                  {grandFinal.regularHomeScore !== null &&
                    grandFinal.regularAwayScore !== null &&
                    grandFinal.regularHomeScore === grandFinal.regularAwayScore && (
                      <div className="mt-3 text-center">
                        <span className="text-[10px] font-bold text-amber-400 block mb-1">
                          Penalties Shootout
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="A"
                            value={grandFinal.penaltiesA ?? ''}
                            onChange={(e) => handleFinalPenaltyChange('A', e.target.value)}
                            className="w-8 h-8 text-center text-xs font-bold bg-slate-950 border border-amber-400/60 rounded text-amber-200"
                          />
                          <span className="text-xs text-amber-400 font-bold">:</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="B"
                            value={grandFinal.penaltiesB ?? ''}
                            onChange={(e) => handleFinalPenaltyChange('B', e.target.value)}
                            className="w-8 h-8 text-center text-xs font-bold bg-slate-950 border border-amber-400/60 rounded text-amber-200"
                          />
                        </div>
                      </div>
                    )}
                </div>

                {/* Finalist B */}
                <div className="col-span-3 flex flex-col items-center text-center">
                  <CrestImage team={getTeam(grandFinal.teamBId)} size="lg" />
                  <span className="font-extrabold text-white text-base mt-2">
                    {getTeam(grandFinal.teamBId)?.name || 'SF 2 Winner'}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase">Finalist 2</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
