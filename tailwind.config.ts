// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B', // Coral Vibrante
          light: '#FF8E8E',
        },
        secondary: {
          DEFAULT: '#0A8585', // Teal Escuro
          light: '#0EADAD',
        },
        dark: {
          DEFAULT: '#333333', // Texto principal
          light: '#555555',
        },
        light: {
          DEFAULT: '#FFFFFF', // Branco
          soft: '#F7F9FA', // Fundo alternativo (Branco Gelo)
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;