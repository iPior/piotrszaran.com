/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ide: {
          bg: '#1e1e2e',
          surface: '#181825',
          'surface-hover': '#242438',
          tab: '#11111b',
          border: '#313244',
          text: '#cdd6f4',
          subtext: '#a6adc8',
          dim: '#6c7086',
          overlay: '#585b70',
          blue: '#89b4fa',
          green: '#a6e3a1',
          peach: '#fab387',
          mauve: '#cba6f7',
          yellow: '#f9e2af',
        },
      },
    },
  },
  plugins: [],
};
