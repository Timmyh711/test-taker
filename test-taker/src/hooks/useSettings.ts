import { useCallback, useEffect, useState } from 'react';
import type { AppSettings, AccentColor, ThemeMode } from '../types/test';
import { ACCENT_CSS } from '../theme/theme';
import { DEFAULT_SETTINGS, loadSettings, resolveThemeMode, saveSettings } from '../utils/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() =>
    resolveThemeMode(settings.themeMode)
  );

  useEffect(() => {
    if (settings.themeMode !== 'auto') {
      setResolvedMode(settings.themeMode);
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setResolvedMode(mq.matches ? 'dark' : 'light');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [settings.themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedMode;
    root.dataset.accent = settings.accentColor;
    root.style.setProperty('--accent', ACCENT_CSS[settings.accentColor]);
  }, [resolvedMode, settings.accentColor]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const setThemeMode = useCallback(
    (themeMode: ThemeMode) => updateSettings({ themeMode }),
    [updateSettings]
  );

  const setAccentColor = useCallback(
    (accentColor: AccentColor) => updateSettings({ accentColor }),
    [updateSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, resolvedMode, setThemeMode, setAccentColor, resetSettings };
}
