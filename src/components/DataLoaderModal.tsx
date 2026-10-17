import React, { useState, useRef } from 'react';
import { TournamentData } from '../types/tournament';
import { 
  getFreshSeasonPreset, 
  getMidSeasonPreset, 
  getCompletedSeasonPreset, 
  getGrandFinalPreset 
} from '../data/tournamentPresets';
import { 
  Database, 
  Clipboard, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface DataLoaderModalProps {
  currentData: TournamentData;
  onLoadData: (data: TournamentData) => void;
  onClose: () => void;
}

export const DataLoaderModal: React.FC<DataLoaderModalProps> = ({
  currentData,
  onLoadData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'paste' | 'file'>('presets');
  const [jsonInput, setJsonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (presetFn: () => TournamentData, label: string) => {
    try {
      const data = presetFn();
      onLoadData(data);
      setSuccessMsg(`Loaded preset: ${label}!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to apply preset');
    }
  };

  const handleLoadPastedJSON = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!jsonInput.trim()) {
      setErrorMsg('Please paste tournament JSON data into the text box.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput) as Partial<TournamentData>;

      if (!parsed.teams || !Array.isArray(parsed.teams) || parsed.teams.length === 0) {
        throw new Error('Invalid tournament data: "teams" array is missing or empty.');
      }

      if (!parsed.matches || !Array.isArray(parsed.matches)) {
        throw new Error('Invalid tournament data: "matches" array is missing.');
      }

      const fullData: TournamentData = {
        version: parsed.version || 3,
        tournamentName: parsed.tournamentName || 'Unemployed Champions League (UCL)',
        season: parsed.season || 'Season 3',
        teams: parsed.teams,
        matches: parsed.matches,
        knockoutTies: parsed.knockoutTies || currentData.knockoutTies,
        grandFinal: parsed.grandFinal || currentData.grandFinal,
        lastUpdated: new Date().toISOString(),
      };

      onLoadData(fullData);
      setSuccessMsg(`Successfully loaded ${fullData.teams.length} teams and ${fullData.matches.length} matches!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(`JSON Parse Error: ${err.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as Partial<TournamentData>;
        if (!parsed.teams || !parsed.matches) {
          throw new Error('Invalid format: file missing teams or matches');
        }

        const fullData: TournamentData = {
          version: parsed.version || 3,
          tournamentName: parsed.tournamentName || 'Unemployed Champions League (UCL)',
          season: parsed.season || 'Season 3',
          teams: parsed.teams,
          matches: parsed.matches,
          knockoutTies: parsed.knockoutTies || currentData.knockoutTies,
          grandFinal: parsed.grandFinal || currentData.grandFinal,
          lastUpdated: new Date().toISOString(),
        };

        onLoadData(fullData);
        setSuccessMsg(`Imported "${file.name}" with ${fullData.teams.length} teams!`);
        setTimeout(() => {
          onClose();
        }, 700);
      } catch (err: any) {
        setErrorMsg(`Failed to import file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-800/60 rounded-2xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-700/50 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Load &amp; Import Tournament Data
              </h3>
              <p className="text-xs text-slate-400">
                Paste JSON data, select an instant season preset, or upload a backup file.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste JSON Data</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'file'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Choose a pre-configured scenario to instantly populate the application state:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Preset 1 */}
                <div
                  onClick={() => handleApplyPreset(getFreshSeasonPreset, 'Fresh Season Slate')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/80 cursor-pointer transition-all hover:bg-slate-850 group"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm mb-1">
                    <span className="text-cyan-400">🌱</span>
                    <span>Fresh Season Slate</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All 14 teams and 42 matches scheduled, 0 matches played. Clean slate for fresh score entry.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-cyan-400 group-hover:underline">
                    Load Fresh Season →
                  </span>
                </div>

                {/* Preset 2 */}
                <div
                  onClick={() => handleApplyPreset(getMidSeasonPreset, 'Mid-Season Live Action')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/80 cursor-pointer transition-all hover:bg-slate-850 group"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm mb-1">
                    <span className="text-amber-400">⚡</span>
                    <span>Mid-Season Action</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Matchdays 1 to 5 completed with scores, goalscorers, cards, saves, and live table standings.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-amber-400 group-hover:underline">
                    Load Mid-Season →
                  </span>
                </div>

                {/* Preset 3 */}
                <div
                  onClick={() => handleApplyPreset(getCompletedSeasonPreset, 'Completed Regular Season')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/80 cursor-pointer transition-all hover:bg-slate-850 group"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm mb-1">
                    <span className="text-emerald-400">🏆</span>
                    <span>Full 11 Matchdays Done</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All 42 league matches played. Standings locked with Top 4 directly into QFs and 5th–12th in Play-offs.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-emerald-400 group-hover:underline">
                    Load Completed Season →
                  </span>
                </div>

                {/* Preset 4 */}
                <div
                  onClick={() => handleApplyPreset(getGrandFinalPreset, 'Grand Final Decider')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/80 cursor-pointer transition-all hover:bg-slate-850 group"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm mb-1">
                    <span className="text-yellow-400">👑</span>
                    <span>Grand Final Showdown</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Complete knockout bracket played through Play-offs, Quarters, Semis, and Grand Final winner crowned!
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-yellow-400 group-hover:underline">
                    Load Grand Final →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE JSON */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Paste your raw JSON text below:</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = JSON.stringify(getFreshSeasonPreset(), null, 2);
                    setJsonInput(sample);
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Insert Sample JSON Template
                </button>
              </div>

              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste JSON here... e.g. { "teams": [...], "matches": [...] }'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 placeholder-slate-600 resize-y"
              />

              <button
                type="button"
                onClick={handleLoadPastedJSON}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.99]"
              >
                Apply &amp; Load Pasted JSON
              </button>
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {activeTab === 'file' && (
            <div className="space-y-4 text-center py-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,application/json"
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-white text-sm">
                  Click to choose a JSON tournament file
                </div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Supports exported backups from UCL Season 3 or standard tournament JSON objects.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Current: {currentData.teams.length} clubs • {currentData.matches.filter(m => m.status === 'completed').length}/{currentData.matches.length} played
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
