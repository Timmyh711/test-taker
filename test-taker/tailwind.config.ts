import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Editorial serif for content and headings
        serif: ['Georgia', 'Baskerville', 'Garamond', 'serif'],
        // Clean sans-serif for UI labels and utilities
        mono: ['SF Mono', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Archival paper tones
        editorial: {
          50: '#FAF8F5',
          100: '#F5F3F0',
          900: '#1C1C1E',
        },
        // Border palette
        border: {
          light: '#E5E5E5',
          dark: '#2D2D2D',
        },
      },
      borderRadius: {
        none: '0px',
      },
      spacing: {
        rule: '1px',
      },
      backgroundColor: {
        'paper-light': '#FAF8F5',
        'paper-dark': '#1C1C1E',
      },
      textColor: {
        'editorial-dark': '#1C1C1E',
        'editorial-light': '#F5F5F5',
      },
      borderColor: {
        'editorial-light': '#E5E5E5',
        'editorial-dark': '#2D2D2D',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Disable MUI-like rounded corners
    borderRadius: false,
  },
} satisfies Config;
