import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://scenkonsult.se',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  // Trailing slash = always → matchar WordPress-URLs exakt
  trailingSlash: 'always',
  // Aggressivare JS-minify via terser (default är esbuild)
  // Sparar ~3 KB JS per bundle vs esbuild — fixar PSI "Minifiera JavaScript"-flagga
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,  // behåll console.log för debugging i prod (Sven-loggning etc)
          passes: 2,
        },
        format: {
          comments: false,
        },
      },
    },
  },
});

