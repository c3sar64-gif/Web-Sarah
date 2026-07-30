import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E4002B',
          dark: '#B4001F',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
