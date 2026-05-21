import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://scenkonsult.se',
  integrations: [
    tailwind(),
    sitemap({
      // Exkludera privata/admin-sidor från sitemap
      // (de har också noindex + robots.txt-Disallow, men sitemap-närvaro
      // gör att de hamnar i GSC "Discovered – currently not indexed" som skräp)
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/order/') &&
        !page.includes('/sign/') &&
        !page.includes('/tack/'),
    }),
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

