import React, { useRef } from 'react';
import { 
  Trophy, 
  CalendarDays, 
  TableProperties, 
  GitBranch, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck,
  Play
} from 'lucide-react';

export type ActiveTab = 'standings' | 'fixtures' | 'knockout' | 'leaderboards' | 'teams';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onSimulateAll: () => void;
  onOpenDataLoader: () => void;
  completedMatchesCount: number;
  totalMatchesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  onImport,
  onReset,
  onSimulateAll,
  onOpenDataLoader,
  completedMatchesCount,
  totalMatchesCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'standings', label: 'Standings', icon: <TableProperties className="w-4 h-4" /> },
    { 
      id: 'fixtures', 
      label: 'Fixtures & Scores', 
      icon: <CalendarDays className="w-4 h-4" />,
      badge: `${completedMatchesCount}/${totalMatchesCount}` 
    },
    { id: 'knockout', label: 'Knockout Bracket', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'leaderboards', label: 'Player Stats', icon: <Trophy className="w-4 h-4" /> },
    { id: 'teams', label: 'Club Hub', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b19]/90 backdrop-blur-md border-b border-cyan-950/60 shadow-xl">
      {/* Top Banner with Starball aesthetics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Tournament Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            <Trophy className="w-6 h-6 text-yellow-400 filter drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold tracking-wide text-white uppercase font-sans">
                Unemployed Champions League
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest shadow-sm">
                Season 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              14 Elite Clubs • 3 Seeding Pots • 11 Matchdays • 2-Leg Aggregate Knockouts
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Load / Paste Data Button */}
          <button
            onClick={onOpenDataLoader}
            title="Load presets, paste JSON data, or upload files"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Load / Paste Data</span>
          </button>

          {/* Quick Simulate All */}
          <button
            onClick={onSimulateAll}
            title="Simulate all remaining scheduled matches with realistic results and scorers"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-all hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Simulate All</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExport}
            title="Download full tournament data as JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          {/* Reset Tournament */}
          <button
            onClick={onReset}
            title="Reset tournament back to initial setup"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/70">
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
