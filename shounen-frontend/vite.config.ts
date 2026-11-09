import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Keep the same output path Angular used so the existing nginx config keeps working.
    outDir: 'dist/shounen-frontend',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // In dev, forward API calls to the local backend so the app can just use `/api`.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
