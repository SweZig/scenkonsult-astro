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
});
