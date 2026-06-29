// ─── Types for the entire Tebak Kata game ────────────────────────────────

export type GameScreen = 'home' | 'custom' | 'rotate' | 'gameplay' | 'results';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;       // CSS color value for border + icon
  glowColor: string;   // rgba for box-shadow glow
  badge?: string;      // optional top-right badge e.g. "POPULER"
  words: string[];
}

export interface WordResult {
  word: string;
  status: 'correct' | 'pass';
}

export interface LeaderboardEntry {
  name: string;
  totalScore: number;
}

export interface CustomDeck {
  name: string;
  words: string[];
}
