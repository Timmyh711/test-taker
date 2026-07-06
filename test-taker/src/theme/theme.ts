import type { AccentColor } from '../types/test';

export const statusColors = {
  not_started: '#6b6560',
  in_progress: '#6b4423',
  answered: '#3d4f36',
  flagged: '#5c2a2a',
} as const;

export const ACCENT_OPTIONS: { id: AccentColor; label: string; color: string }[] = [
  { id: 'blue', label: 'Blue', color: '#2c3e50' },
  { id: 'purple', label: 'Purple', color: '#4a3a5c' },
  { id: 'green', label: 'Green', color: '#3d4f36' },
  { id: 'orange', label: 'Orange', color: '#6b4423' },
  { id: 'red', label: 'Red', color: '#5c2a2a' },
];

export const ACCENT_CSS: Record<AccentColor, string> = {
  blue: '#2c3e50',
  purple: '#4a3a5c',
  green: '#3d4f36',
  orange: '#6b4423',
  red: '#5c2a2a',
};
