import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Baskerville', 'Baskerville Old Face', 'Garamond', 'serif'],
        utility: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    borderRadius: false,
  },
} satisfies Config;
