/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:   '#0d1117',
          navy:   '#1a2744',
          orange: '#d96b2a',
          'orange-light': '#f08040',
          gray:   '#8b9cb0',
          light:  '#e8edf2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
