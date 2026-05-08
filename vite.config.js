import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/iss': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iss/, ''),
      },
      '/api/ai': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, ''),
      },
    },
  },
});
