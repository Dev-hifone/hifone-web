import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(),
     prerender({
      routes: [
        '/',
        '/services',
        '/devices',
        '/about',
        '/contact',
        '/blog',
        '/accessories',
        '/book',
        // Add your key dynamic SEO pages:
        '/iphone-15-pro-screen-repair-adelaide',
        '/iphone-14-screen-repair-adelaide',
        '/iphone-14-battery-replacement-adelaide',
        '/samsung-s24-screen-repair-adelaide',
        '/ipad-pro-screen-repair-adelaide',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
 build: {
  outDir: 'build',
  target: 'es2015',
},
});