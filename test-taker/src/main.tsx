import React from 'react';
import ReactDOM from 'react-dom/client';
import './editorial.css';
import App from './App';
import { ACCENT_CSS } from './theme/theme';
import { loadSettings, resolveThemeMode } from './utils/settings';

const settings = loadSettings();
const resolvedMode = resolveThemeMode(settings.themeMode);
document.documentElement.dataset.theme = resolvedMode;
document.documentElement.dataset.accent = settings.accentColor;
document.documentElement.style.setProperty('--accent', ACCENT_CSS[settings.accentColor]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
