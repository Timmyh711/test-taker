import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import './editorial.css';
import App from './App';
import { getAccentCss } from './theme/theme';
import { loadSettings, resolveThemeMode } from './utils/settings';

const settings = loadSettings();
const resolvedMode = resolveThemeMode(settings.themeMode);
document.documentElement.dataset.theme = resolvedMode;
document.documentElement.dataset.accent = settings.accentColor;
document.documentElement.style.setProperty('--accent', getAccentCss(resolvedMode, settings.accentColor));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
