/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      colors: {
        brand: {
          dark:           '#0c0a24',   // Mörk indigo (body/bakgrund)
          navy:           '#1e1850',   // Djup indigo (kortbakgrunder)
          orange:         '#c4b5f4',   // Ljus lavendel (accent på mörk bakgrund)
          'orange-light': '#e2dcfb',   // Ljusare lavendel (hover)
          gray:           '#9187c0',   // Dämpad lila (sekundär text)
          light:          '#ede9f8',   // Indigo-tint (ljusa sektioner)
        }
      },
      fontFamily: {
        sans: ['Source Sans 3', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': 'min(1280px, 100%)',
      },
      spacing: {
        'nav': 'calc(36px + 74px)',
        'nav-mobile': 'calc(32px + 64px)',
      },
    },
  },
  plugins: [],
}
