import React, { useState } from 'react';
import { Team, Player } from '../types/tournament';
import { CrestImage } from './CrestImage';
import { 
  ShieldCheck, 
  Edit2, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { DEFAULT_TEAMS } from '../data/defaultTournamentData';

interface TeamManagerHubProps {
  teams: Team[];
  onUpdateTeam: (updatedTeam: Team) => void;
  onRestoreDefaultLogos: () => void;
}

export const TeamManagerHub: React.FC<TeamManagerHubProps> = ({
  teams,
  onUpdateTeam,
  onRestoreDefaultLogos,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [logoInput, setLogoInput] = useState<string>(teams[0]?.logo || '');
  const [nameInput, setNameInput] = useState<string>(teams[0]?.name || '');
  const [stadiumInput, setStadiumInput] = useState<string>(teams[0]?.stadium || '');
  const [primaryColorInput, setPrimaryColorInput] = useState<string>(teams[0]?.primaryColor || '#004D98');
  const [secondaryColorInput, setSecondaryColorInput] = useState<string>(teams[0]?.secondaryColor || '#A50044');

  // New player form
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState(10);
  const [newPlayerPos, setNewPlayerPos] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('FWD');

  const handleSelectTeam = (t: Team) => {
    setSelectedTeam(t);
    setLogoInput(t.logo);
    setNameInput(t.name);
    setStadiumInput(t.stadium);
    setPrimaryColorInput(t.primaryColor);
    setSecondaryColorInput(t.secondaryColor);
  };

  const handleSaveChanges = () => {
    const updated: Team = {
      ...selectedTeam,
      name: nameInput.trim() || selectedTeam.name,
      logo: logoInput.trim(),
      stadium: stadiumInput.trim() || selectedTeam.stadium,
      primaryColor: primaryColorInput,
      secondaryColor: secondaryColorInput,
    };
    onUpdateTeam(updated);
    setSelectedTeam(updated);
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newP: Player = {
      id: `custom-p-${Date.now()}`,
      name: newPlayerName.trim(),
      teamId: selectedTeam.id,
      number: newPlayerNumber,
      position: newPlayerPos,
    };

    const updatedRoster = [...selectedTeam.roster, newP];
    const updated: Team = {
      ...selectedTeam,
      roster: updatedRoster,
    };

    onUpdateTeam(updated);
    setSelectedTeam(updated);
    setNewPlayerName('');
    setNewPlayerNumber(prev => prev + 1);
  };

  const handleDeletePlayer = (playerId: string) => {
    const updatedRoster = selectedTeam.roster.filter(p => p.id !== playerId);
    const updated: Team = {
      ...selectedTeam,
      roster: updatedRoster,
    };
    onUpdateTeam(updated);
    setSelectedTeam(updated);
  };

  const handleResetCrestToDefault = () => {
    const orig = DEFAULT_TEAMS.find(t => t.id === selectedTeam.id);
    if (orig) {
      setLogoInput(orig.logo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Club & Crest Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize club logos with image URLs or fallback SVG monogram badges, edit stadium venues, and manage player squad rosters.
          </p>
        </div>

        <button
          onClick={onRestoreDefaultLogos}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Restore All Official Crests</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: 14 Teams Selector */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Club (14 Teams)
          </h3>
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {teams.map((t) => {
              const isSelected = selectedTeam.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTeam(t)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CrestImage team={t} size="sm" />
                    <div>
                      <span className="font-bold text-sm text-white block leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.stadium}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    t.pot === 1
                      ? 'bg-amber-500/20 text-amber-300'
                      : t.pot === 2
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    Pot {t.pot}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Edit Details & Squad */}
        <div className="lg:col-span-8 space-y-6">
          {/* Club Identity Settings Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <CrestImage team={selectedTeam} size="lg" />
                <div>
                  <h3 className="text-xl font-black text-white">{selectedTeam.name}</h3>
                  <p className="text-xs text-slate-400">Pot {selectedTeam.pot} Seed</p>
                </div>
              </div>

              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Club Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Club Name */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Club Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Stadium */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Home Stadium</label>
                <input
                  type="text"
                  value={stadiumInput}
                  onChange={(e) => setStadiumInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Logo URL */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Crest Image URL (PNG/SVG/WebP)</label>
                  <button
                    type="button"
                    onClick={handleResetCrestToDefault}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Reset to official default
                  </button>
                </div>
                <input
                  type="text"
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  placeholder="https://example.com/crest.png (Leave blank to use SVG monogram fallback)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If the URL fails or is empty, a badge will automatically be rendered with club initials and colors.
                </p>
              </div>

              {/* Colors */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColorInput}
                    onChange={(e) => setPrimaryColorInput(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColorInput}
                    onChange={(e) => setPrimaryColorInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono uppercase text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColorInput}
                    onChange={(e) => setSecondaryColorInput(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColorInput}
                    onChange={(e) => setSecondaryColorInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono uppercase text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Squad Roster Management */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Squad Roster ({selectedTeam.roster.length} Players)</span>
            </h3>

            {/* Add Player Form */}
            <form onSubmit={handleAddPlayer} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-2">
              <input
                type="text"
                placeholder="Player full name..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 min-w-[140px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                min="1"
                max="99"
                placeholder="#"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(parseInt(e.target.value) || 1)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center font-mono text-white"
              />
              <select
                value={newPlayerPos}
                onChange={(e) => setNewPlayerPos(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
              >
                <option value="GK">GK</option>
                <option value="DEF">DEF</option>
                <option value="MID">MID</option>
                <option value="FWD">FWD</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg whitespace-nowrap shadow"
              >
                + Add Player
              </button>
            </form>

            {/* Squad List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {selectedTeam.roster.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-right font-mono font-bold text-cyan-400">
                      #{player.number}
                    </span>
                    <span className="font-semibold text-slate-200">{player.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
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
                    <button
                      type="button"
                      onClick={() => handleDeletePlayer(player.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
