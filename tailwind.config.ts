import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
      screens: {
        xl: '1440px'
      }
    },
    extend: {
      padding: {
        'container-lg': '4rem',
        'container-base': '1.5rem'
      },
      fontFamily: {
        caveat: ['var(--font-caveat)'],
        inter: ['var(--font-inter)']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'blog-fancy': {
          1: '#EA8C55',
          2: '#C75146',
          3: '#AD2E24',
          4: '#81171B',
          5: '#540804'
        }
      }
    }
  },
  plugins: []
};

export default config;
