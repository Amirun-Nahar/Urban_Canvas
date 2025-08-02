/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Marcellus', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#baddff',
          300: '#7cc2ff',
          400: '#3aa1ff',
          500: '#0a84ff',
          600: '#0062cc',
          700: '#0052ab',
          800: '#004590',
          900: '#003872',
        },
        secondary: {
          50: '#f6f8fa',
          100: '#edf1f5',
          200: '#dce3eb',
          300: '#bfccd9',
          400: '#94a6bb',
          500: '#73849c',
          600: '#5c6b80',
          700: '#4d5a6b',
          800: '#424d5c',
          900: '#394250',
        },
        accent: {
          50: '#fbf7ed',
          100: '#f5ebcc',
          200: '#ebd699',
          300: '#e0b85c',
          400: '#d69a2c',
          500: '#b37d1a',
          600: '#956314',
          700: '#784d13',
          800: '#633e15',
          900: '#523415',
        },
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0a84ff",
          "secondary": "#73849c",
          "accent": "#d69a2c",
          "neutral": "#394250",
          "base-100": "#ffffff",
          "base-200": "#f6f8fa",
          "base-300": "#edf1f5",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
          "info": "#3b82f6"
        },
        dark: {
          "primary": "#3aa1ff",
          "secondary": "#94a6bb",
          "accent": "#e0b85c",
          "neutral": "#dce3eb",
          "base-100": "#1a1f2b",
          "base-200": "#242935",
          "base-300": "#2e3444",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
          "info": "#60a5fa"
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  }
} 