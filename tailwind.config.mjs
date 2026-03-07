/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:           '#0c0a24',   // Var: #0d1117  → Mörk indigo (bild/video-bakgrund)
          navy:           '#1e1850',   // Var: #1a2744  → Djup indigo (kortkort/sektionsbakgrund)
          orange:         '#c4b5f4',   // Var: #d96b2a  → Ljus lavendel (accentfärg på mörk bakgrund)
          'orange-light': '#e2dcfb',   // Var: #f08040  → Ljusare lavendel (hover-state)
          gray:           '#9187c0',   // Var: #8b9cb0  → Dämpad lila (sekundär text)
          light:          '#ede9f8',   // Var: #e8edf2  → Indigo-tint (ljusa sektioner)
        }
      },
      fontFamily: {
        sans: ['Source Sans 3', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
