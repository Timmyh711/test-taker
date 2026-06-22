import type { AppSettings } from '../types/test';

const SETTINGS_KEY = 'test-taker-settings';

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  accentColor: 'blue',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // fail silently
  }
}

export function resolveThemeMode(themeMode: AppSettings['themeMode']): 'light' | 'dark' {
  if (themeMode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return themeMode;
}
