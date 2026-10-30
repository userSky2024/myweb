// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages 项目页：https://usersky2024.github.io/myweb/
export default defineConfig({
  site: 'https://usersky2024.github.io',
  base: '/myweb',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
