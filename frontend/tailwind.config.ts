import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F4ED',
        'rose-metallic': '#E0A9A1',
        'rose-metallic-dark': '#C98B81',
        sage: '#A3B59D',
        'sage-dark': '#8A9D83',
        mauve: '#734F62',
        'mauve-dark': '#5C3F4F',
        taupe: '#D1C5B8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Poppins', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '22px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(115,79,98,0.10)',
      },
    },
  },
  plugins: [],
} satisfies Config
