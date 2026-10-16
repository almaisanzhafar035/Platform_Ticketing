import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- 1. Import plugin Tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://192.168.1.15:8081/api',
        changeOrigin: true,
        secure: false,
      },
    },
  }
});