/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-180%)' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'scroll': 'scroll 7s linear infinite',
        'slide-left': 'slide-in-left 1s ease-out forwards',
        'slide-right': 'slide-in-right 1s ease-out forwards',
        'slide-up': 'slide-up 1s ease-out forwards'
      },
      textShadow: {
        'default': '0 2px 4px rgba(0,0,0,0.3)',
        'lg': '0 2px 6px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
        '.text-shadow-lg': {
          textShadow: '0 2px 6px rgba(0,0,0,0.5)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
