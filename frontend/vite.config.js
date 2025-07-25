import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://rs-engineering.pages.dev',
      routes: [
        '/', // Home
        '/computer',
        '/electronics',
        '/fashion',
        '/lifestyle',
        '/vehicle',
        '/search-results',
        '/product/1', 
        '/cart',
        '/login',
        '/order-confirmation',
        '/my-orders',
        '/contact',
        '/about',
        '/company',
        '/store',
      ]
    })
  ]
});
