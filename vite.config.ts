// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy HitPay API requests
      '/api/hitpay': {
        target: 'https://api.sandbox.hit-pay.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hitpay/, '/v1'),
        configure: (proxy, _options) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Log the proxied request for debugging
            console.log('Proxying:', req.method, req.url);
          });
        }
      }
    }
  }
});