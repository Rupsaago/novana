import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg:     '#F7F2ED',  // warm parchment background
          card:   '#EFE6DF',  // slightly deeper card surface
          purple: '#7B6FA8',  // primary brand purple
          'purple-light': '#A89ED0',
          'purple-dark':  '#5A5080',
          peach:  '#E8A98B',  // warm peach accent
          rose:   '#D28CA7',  // dusty rose accent
          sky:    '#8FA7C6',  // muted sky blue
          text:   '#2F2A28',  // near-black warm text
          muted:  '#6F6A66',  // secondary warm gray
          border: '#DDD4CA',  // subtle warm border
          white:  '#FDFAF7',  // off-white for cards
        },
      },
      fontFamily: {
        // DM Sans: warm, rounded, modern — loaded in layout.tsx via Google Fonts
        sans:    ['DM Sans', 'sans-serif'],
        // Fraunces: a beautiful editorial serif for headings
        display: ['Fraunces', 'serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        // Very soft purple-tinted shadow for cards
        'nova-sm': '0 2px 8px rgba(123, 111, 168, 0.08)',
        'nova':    '0 4px 24px rgba(123, 111, 168, 0.10)',
        'nova-lg': '0 8px 40px rgba(123, 111, 168, 0.14)',
      },
      backgroundImage: {
        // Subtle gradient used on hero
        'nova-gradient': 'linear-gradient(135deg, #7B6FA8 0%, #D28CA7 55%, #E8A98B 100%)',
        'nova-soft':     'linear-gradient(160deg, #F7F2ED 0%, #EFE6DF 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up':     'fade-up 0.6s ease-out forwards',
        'fade-up-200': 'fade-up 0.6s ease-out 0.2s forwards',
        'fade-up-400': 'fade-up 0.6s ease-out 0.4s forwards',
        'fade-up-600': 'fade-up 0.6s ease-out 0.6s forwards',
        'fade-in':     'fade-in 0.8s ease-out forwards',
        float:         'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
