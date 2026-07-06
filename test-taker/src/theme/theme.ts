import type { AccentColor } from '../types/test';

export const statusColors = {
  not_started: '#6b6560',
  in_progress: '#6b4423',
  answered: '#3d4f36',
  flagged: '#5c2a2a',
} as const;

export const statusColorsDark = {
  not_started: '#9a9590',
  in_progress: '#e8b86d',
  answered: '#8fbc6a',
  flagged: '#e88a8a',
} as const;

export const ACCENT_LIGHT: Record<AccentColor, string> = {
  blue: '#2c3e50',
  purple: '#4a3a5c',
  green: '#3d4f36',
  orange: '#6b4423',
  red: '#5c2a2a',
};

export const ACCENT_DARK: Record<AccentColor, string> = {
  blue: '#6eb5e8',
  purple: '#c9a0e8',
  green: '#8fd48f',
  orange: '#e8a85c',
  red: '#e88a8a',
};

/** @deprecated Use getAccentCss instead */
export const ACCENT_CSS = ACCENT_LIGHT;

export function getAccentCss(mode: 'light' | 'dark', accent: AccentColor): string {
  return mode === 'dark' ? ACCENT_DARK[accent] : ACCENT_LIGHT[accent];
}

export const ACCENT_OPTIONS: { id: AccentColor; label: string; color: string }[] = [
  { id: 'blue', label: 'Blue', color: ACCENT_LIGHT.blue },
  { id: 'purple', label: 'Purple', color: ACCENT_LIGHT.purple },
  { id: 'green', label: 'Green', color: ACCENT_LIGHT.green },
  { id: 'orange', label: 'Orange', color: ACCENT_LIGHT.orange },
  { id: 'red', label: 'Red', color: ACCENT_LIGHT.red },
];

export function getStatusColor(status: keyof typeof statusColors, dark: boolean): string {
  return dark ? statusColorsDark[status] : statusColors[status];
}
