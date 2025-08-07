import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Build optimizations para produção web
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Desabilitado para produção web
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: true,
          pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            router: ['react-router-dom'],
          },
          // Otimização para CDN
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const extType = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/images/[name]-[hash][extname]`
            }
            if (/css/i.test(extType)) {
              return `assets/css/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Configurações para produção web
      target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
      cssTarget: ['chrome58', 'firefox57', 'safari11'],
    },
    
    // Configurações do servidor de desenvolvimento
    server: {
      port: 3000,
      host: true,
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    
    // Preview server (produção local)
    preview: {
      port: 4173,
      host: true,
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' " + (env.VITE_API_URL || 'http://localhost:5006'),
      },
    },
    
    // Performance optimizations
    optimizeDeps: {
      include: [
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'react-router-dom'
      ],
    },
    
    // PWA e Service Worker configurações
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@services': resolve(__dirname, './src/services'),
        '@utils': resolve(__dirname, './src/utils'),
        '@assets': resolve(__dirname, './src/assets'),
      },
    },
  }
})
