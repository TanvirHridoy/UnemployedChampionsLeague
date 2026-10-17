import React, { useState, useEffect } from 'react';
import { 
  TournamentData, 
  Match, 
  KnockoutTie, 
  GrandFinal, 
  Team 
} from './types/tournament';
import { 
  loadTournamentData, 
  saveTournamentData, 
  exportTournamentJSON, 
  importTournamentJSON, 
  resetTournamentData 
} from './utils/storage';
import { calculateStandings } from './utils/standingsCalculator';
import { simulateAllRemaining } from './utils/matchSimulator';
import { DEFAULT_TEAMS } from './data/defaultTournamentData';

import { Navbar, ActiveTab } from './components/Navbar';
import { StandingsTable } from './components/StandingsTable';
import { FixturesManager } from './components/FixturesManager';
import { KnockoutBracketHub } from './components/KnockoutBracketHub';
import { PlayerLeaderboards } from './components/PlayerLeaderboards';
import { TeamManagerHub } from './components/TeamManagerHub';
import { DataLoaderModal } from './components/DataLoaderModal';

export default function App() {
  const [tournamentData, setTournamentData] = useState<TournamentData>(() => loadTournamentData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('standings');
  const [notification, setNotification] = useState<string | null>(null);
  const [isDataLoaderOpen, setIsDataLoaderOpen] = useState(false);

  // Auto-save whenever tournamentData changes
  useEffect(() => {
    saveTournamentData(tournamentData);
  }, [tournamentData]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Match updates
  const handleUpdateMatch = (updatedMatch: Match) => {
    setTournamentData(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m),
    }));
    showToast(`Updated Match: Matchday ${updatedMatch.matchday}`);
  };

  const handleUpdateMatches = (updatedMatches: Match[]) => {
    setTournamentData(prev => ({
      ...prev,
      matches: updatedMatches,
    }));
    showToast('Matchday fixtures updated successfully');
  };

  // Knockout updates
  const handleUpdateTie = (updatedTie: KnockoutTie) => {
    setTournamentData(prev => ({
      ...prev,
      knockoutTies: prev.knockoutTies.map(t => t.id === updatedTie.id ? updatedTie : t),
    }));
    showToast(`Updated ${updatedTie.name}`);
  };

  const handleUpdateGrandFinal = (updatedGf: GrandFinal) => {
    setTournamentData(prev => ({
      ...prev,
      grandFinal: updatedGf,
    }));
    showToast('Updated Grand Final scoreline');
  };

  const handleResetKnockout = () => {
    if (confirm('Reset knockout bracket ties back to empty?')) {
      setTournamentData(prev => ({
        ...prev,
        knockoutTies: prev.knockoutTies.map(t => ({
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
          ...prev.grandFinal,
          teamAId: null,
          teamBId: null,
          regularHomeScore: null,
          regularAwayScore: null,
          penaltiesA: null,
          penaltiesB: null,
          winnerTeamId: null,
          status: 'scheduled',
        },
      }));
      showToast('Knockout bracket reset');
    }
  };

  // Team updates
  const handleUpdateTeam = (updatedTeam: Team) => {
    setTournamentData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t),
    }));
    showToast(`Updated ${updatedTeam.name}`);
  };

  const handleRestoreDefaultLogos = () => {
    if (confirm('Restore all 14 official club crest logos to default?')) {
      setTournamentData(prev => ({
        ...prev,
        teams: prev.teams.map(t => {
          const orig = DEFAULT_TEAMS.find(d => d.id === t.id);
          return orig ? { ...t, logo: orig.logo } : t;
        }),
      }));
      showToast('Official crests restored');
    }
  };

  // Backup & Restore
  const handleExport = () => {
    exportTournamentJSON(tournamentData);
    showToast('Tournament backup exported (.json)');
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importTournamentJSON(file);
      setTournamentData(imported);
      showToast('Tournament data restored successfully!');
    } catch (err: any) {
      alert(`Import failed: ${err.message || 'Invalid JSON file'}`);
    }
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset the entire tournament? This will clear custom events and restore the default state.')) {
      const resetData = resetTournamentData();
      setTournamentData(resetData);
      showToast('Tournament reset to factory default');
    }
  };

  const handleSimulateAll = () => {
    const updated = simulateAllRemaining(tournamentData.matches, tournamentData.teams);
    setTournamentData(prev => ({
      ...prev,
      matches: updated,
    }));
    showToast('Simulated all remaining league matches!');
  };

  // Derived state
  const standings = calculateStandings(tournamentData.teams, tournamentData.matches);
  const completedCount = tournamentData.matches.filter(m => m.status === 'completed').length;
  const totalCount = tournamentData.matches.length;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-white">
      {/* Background UCL Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] bg-cyan-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleResetAll}
        onSimulateAll={handleSimulateAll}
        onOpenDataLoader={() => setIsDataLoaderOpen(true)}
        completedMatchesCount={completedCount}
        totalMatchesCount={totalCount}
      />

      {/* Data Loader Modal */}
      {isDataLoaderOpen && (
        <DataLoaderModal
          currentData={tournamentData}
          onLoadData={(newData) => {
            setTournamentData(newData);
            showToast('Tournament data updated successfully!');
          }}
          onClose={() => setIsDataLoaderOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-cyan-400/50 flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'standings' && (
          <StandingsTable
            standings={standings}
            matches={tournamentData.matches}
          />
        )}

        {activeTab === 'fixtures' && (
          <FixturesManager
            matches={tournamentData.matches}
            teams={tournamentData.teams}
            onUpdateMatch={handleUpdateMatch}
            onUpdateMatches={handleUpdateMatches}
          />
        )}

        {activeTab === 'knockout' && (
          <KnockoutBracketHub
            knockoutTies={tournamentData.knockoutTies}
            grandFinal={tournamentData.grandFinal}
            teams={tournamentData.teams}
            standings={standings}
            onUpdateTie={handleUpdateTie}
            onUpdateGrandFinal={handleUpdateGrandFinal}
            onResetKnockout={handleResetKnockout}
          />
        )}

        {activeTab === 'leaderboards' && (
          <PlayerLeaderboards
            teams={tournamentData.teams}
            matches={tournamentData.matches}
          />
        )}

        {activeTab === 'teams' && (
          <TeamManagerHub
            teams={tournamentData.teams}
            onUpdateTeam={handleUpdateTeam}
            onRestoreDefaultLogos={handleRestoreDefaultLogos}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Unemployed Champions League (UCL) — Season 3 • 14 Teams • 3 Pots • 42 League Matches
          </span>
          <span className="text-[11px] text-slate-400">
            Official Broadcast &amp; Tournament Hub
          </span>
        </div>
      </footer>
    </div>
  );
}
