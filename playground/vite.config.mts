import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            target: 'http://localhost:5320/api',
            ws: true,
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                if (req.url?.startsWith('/api')) {
                  req.url = req.url.replace(/^\/api/, '');
                  proxyReq.path = req.url;
                }
              });
            }
          }
        }
      }
    }
  };
});
