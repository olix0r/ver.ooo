/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-light': 'rgb(var(--color-primary-light))',
        'primary-dark': 'rgb(var(--color-primary-dark))',
        'secondary-light': 'rgb(var(--color-secondary-light))',
        'secondary-dark': 'rgb(var(--color-secondary-dark))',
        'header-light': 'rgb(var(--color-header-light))',
        'header-dark': 'rgb(var(--color-header-dark))',
        'accent-light': 'rgb(var(--color-accent-light))',
        'accent-dark': 'rgb(var(--color-accent-dark))',
        'text-light': 'rgb(var(--color-text-light))',
        'text-dark': 'rgb(var(--color-text-dark))',
        'border-light': 'rgb(var(--color-border-light))',
        'border-dark': 'rgb(var(--color-border-dark))',
      },
      fontFamily: {
        default: 'var(--font-family)',
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
};
