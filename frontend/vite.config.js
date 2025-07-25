import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import fetch from 'node-fetch';

export default defineConfig(async () => {
  // Fetch products from your backend
  const response = await fetch('https://rs-engineering-api.onrender.com/products'); // Change to your actual backend URL
  const products = await response.json();

  // Convert each product into a route like /product/1
  const productRoutes = products.map((product) => `/product/${product.id}`);

  // Static routes
  const staticRoutes = [
    '/',
    '/computer',
    '/electronics',
    '/fashion',
    '/lifestyle',
    '/vehicle',
    '/search-results',
    '/cart',
    '/login',
    '/order-confirmation',
    '/my-orders',
    '/contact',
    '/about',
    '/company',
    '/store'
  ];

  return {
    plugins: [
      react(),
      Sitemap({
        hostname: 'https://rs-engineering.pages.dev',
        routes: [...staticRoutes, ...productRoutes],
      }),
    ],
  };
});
