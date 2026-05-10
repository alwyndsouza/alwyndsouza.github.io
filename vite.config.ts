import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { seoRssPlugin } from './vite-plugins/seo-rss';

const SITE = {
  url: 'https://alwyndsouza.github.io',
  name: 'Alwyn Dsouza',
  title: 'Alwyn Dsouza — Data Engineering, DataOps & AI',
  description:
    'Practical writing on Data Engineering, DataOps, dbt, Databricks, and AI Agents. Articles, open-source projects, and lessons from production data platforms.',
  defaultOgImage: '/og-default.svg',
  language: 'en',
} as const;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoRssPlugin({ site: SITE, root: __dirname }),
  ],
  publicDir: 'frontend/public',
  assetsInclude: ['**/*.md'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
