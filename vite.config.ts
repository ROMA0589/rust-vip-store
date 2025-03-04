import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_PAYPAL_CLIENT_ID': JSON.stringify(env.VITE_PAYPAL_CLIENT_ID),
      'process.env.VITE_PAYPAL_CLIENT_SECRET': JSON.stringify(env.VITE_PAYPAL_CLIENT_SECRET),
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api-m.sandbox.paypal.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
