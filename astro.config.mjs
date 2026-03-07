import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://scenkonsult.se',
  integrations: [
    tailwind()
  ],
  // Trailing slash = always → matchar WordPress-URLs exakt
  trailingSlash: 'always',
});
