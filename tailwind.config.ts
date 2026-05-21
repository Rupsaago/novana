import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg:           '#F7F2ED',
          card:         '#EFE6DF',
          white:        '#FFFCF7',
          purple:       '#7B6FA8',
          'purple-dark':'#5A5080',
          'purple-light':'#A89ED0',
          peach:        '#E8A98B',
          rose:         '#D28CA7',
          sky:          '#8FA7C6',
          text:         '#2F2A28',
          muted:        '#6F6A66',
          border:       '#DDD4CA',
          'border-soft':'#E8DACC',
        },
      },
      fontFamily: {
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'nova-sm': '0 2px 12px rgba(123,111,168,0.10)',
        'nova':    '0 10px 36px rgba(123,111,168,0.14), 0 1px 2px rgba(47,42,40,0.04)',
        'nova-lg': '0 18px 60px rgba(123,111,168,0.20)',
      },
      backgroundImage: {
        'nova-gradient': 'linear-gradient(135deg, #7B6FA8 0%, #D28CA7 100%)',
        'sunset':        'linear-gradient(135deg, #C9B7D8 0%, #E8A98B 55%, #F1C9A8 100%)',
        'sunset-deep':   'linear-gradient(160deg, #4A3F66 0%, #7B6FA8 35%, #D28CA7 70%, #E8A98B 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
