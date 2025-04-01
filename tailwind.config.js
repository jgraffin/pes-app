module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alternate: ['DIN Alternate', 'sans-serif'],
        bold: ['DIN', 'sans-serif'],
      },
      keyframes: {
        'top-to-bottom': {
          '0%': { opacity: '0', marginTop: '-20px' },
          '100%': { opacity: '1', marginTop: '-4px' },
        },
        'bottom-to-top': {
          '0%': { opacity: '0', marginBottom: '100px' },
          '100%': { opacity: '1', marginBottom: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'top-to-bottom': 'top-to-bottom 0.8s ease-in forwards',
        'bottom-to-top': 'bottom-to-top 0.8s ease-in forwards',
        'fade-in': 'fade-in 0.5s ease-in-out forwards',
      },
    },
    backgroundColor: {
      'dark-blue': '#171733',
      'dark': '#000000',
      transparent: 'transparent'
    },

  },
  plugins: [],
}