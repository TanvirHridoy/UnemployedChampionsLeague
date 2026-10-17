import { TournamentData } from '../types/tournament';
import { INITIAL_TOURNAMENT_DATA } from '../data/defaultTournamentData';

const STORAGE_KEY = 'ucl_season3_data_v3';

export function loadTournamentData(): TournamentData {
  if (typeof window === 'undefined') return INITIAL_TOURNAMENT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTournamentData(INITIAL_TOURNAMENT_DATA);
      return INITIAL_TOURNAMENT_DATA;
    }
    const parsed = JSON.parse(raw) as TournamentData;
    // Basic schema check
    if (!parsed.teams || !parsed.matches || !parsed.knockoutTies) {
      return INITIAL_TOURNAMENT_DATA;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load tournament data from localStorage:', err);
    return INITIAL_TOURNAMENT_DATA;
  }
}

export function saveTournamentData(data: TournamentData): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save tournament data:', err);
  }
}

export function exportTournamentJSON(data: TournamentData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ucl_season3_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importTournamentJSON(file: File): Promise<TournamentData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as TournamentData;
        if (!parsed.teams || !parsed.matches) {
          throw new Error('Invalid UCL data format: missing teams or matches');
        }
        saveTournamentData(parsed);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}

export function resetTournamentData(): TournamentData {
  localStorage.removeItem(STORAGE_KEY);
  saveTournamentData(INITIAL_TOURNAMENT_DATA);
  return INITIAL_TOURNAMENT_DATA;
}
