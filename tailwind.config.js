import tailwindcssDarkMode from 'tailwindcss-dark-mode';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'light-blue': '#2192FF',
        'light-green': '#38E54D',
        'light-gold': '#FDFF00',
        'dark-blue': '#10316B',
        'dark-green': '#0B8457',
        'dark-gold': '#EAC100',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      borderColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [
    tailwindcssDarkMode(),
  ],
  // darkMode: 'class', // allows toggling dark mode with class="dark"
}
