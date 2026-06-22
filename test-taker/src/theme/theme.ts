import { createTheme, type PaletteMode } from '@mui/material/styles';
import type { AccentColor } from '../types/test';

const BODY_FONT = '"Roboto", "Inter", "Helvetica", "Arial", sans-serif';
const HEADING_FONT = '"Google Sans", "DM Sans", "Roboto", sans-serif';

const headingStyle = {
  fontFamily: HEADING_FONT,
  fontWeight: 700,
  letterSpacing: '-0.02em',
};

const M3_ACCENTS: Record<AccentColor, { main: string; light: string; dark: string; container: string }> = {
  blue: { main: '#0b57d0', light: '#4c8df6', dark: '#0842a0', container: '#d3e3fd' },
  purple: { main: '#6750a4', light: '#9a82db', dark: '#4f378b', container: '#eaddff' },
  green: { main: '#146c2e', light: '#34a853', dark: '#0d652d', container: '#c4eed0' },
  orange: { main: '#e37400', light: '#f9ab00', dark: '#c26401', container: '#ffe0b2' },
  red: { main: '#b3261e', light: '#e46962', dark: '#8c1d18', container: '#f9dedc' },
};

export function createAppTheme(mode: PaletteMode, accent: AccentColor) {
  const isDark = mode === 'dark';
  const accentPalette = M3_ACCENTS[accent];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? accentPalette.light : accentPalette.main,
        light: accentPalette.light,
        dark: accentPalette.dark,
        contrastText: isDark ? '#1a1c1e' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#ccc2dc' : accentPalette.dark,
      },
      background: {
        default: isDark ? '#1a1c1e' : '#fef7ff',
        paper: isDark ? '#2b2930' : '#ffffff',
      },
      success: { main: isDark ? '#6dd58c' : '#146c2e' },
      warning: { main: isDark ? '#f9ab00' : '#e37400' },
      error: { main: isDark ? '#f2b8b5' : '#b3261e' },
      text: {
        primary: isDark ? '#e6e1e5' : '#1a1c1e',
        secondary: isDark ? '#cac4d0' : '#49454f',
      },
      divider: isDark ? '#49454f' : '#e7e0ec',
      action: {
        hover: isDark ? 'rgba(230, 225, 229, 0.08)' : 'rgba(26, 28, 30, 0.04)',
        selected: isDark ? 'rgba(230, 225, 229, 0.12)' : 'rgba(26, 28, 30, 0.08)',
      },
    },
    typography: {
      fontFamily: BODY_FONT,
      h1: headingStyle,
      h2: headingStyle,
      h3: headingStyle,
      h4: headingStyle,
      h5: headingStyle,
      h6: headingStyle,
      subtitle1: { fontFamily: BODY_FONT, fontWeight: 500 },
      subtitle2: { fontFamily: BODY_FONT, fontWeight: 500 },
      body1: { fontFamily: BODY_FONT },
      body2: { fontFamily: BODY_FONT },
      button: { fontFamily: BODY_FONT, fontWeight: 500, letterSpacing: '0.01em' },
      caption: { fontFamily: BODY_FONT },
      overline: { fontFamily: BODY_FONT },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 20,
            padding: '10px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.4)'
              : '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: 'none' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 12 },
          },
        },
      },
    },
  });
}

export const statusColors = {
  not_started: '#79747e',
  in_progress: '#e37400',
  answered: '#146c2e',
  flagged: '#b3261e',
} as const;

export const ACCENT_OPTIONS: { id: AccentColor; label: string; color: string }[] = [
  { id: 'blue', label: 'Blue', color: '#0b57d0' },
  { id: 'purple', label: 'Purple', color: '#6750a4' },
  { id: 'green', label: 'Green', color: '#146c2e' },
  { id: 'orange', label: 'Orange', color: '#e37400' },
  { id: 'red', label: 'Red', color: '#b3261e' },
];
