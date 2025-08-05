import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Build optimizations
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remove console.log em produção
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            router: ['react-router-dom'],
          },
        },
      },
    },
    
    // Security headers para desenvolvimento
    server: {
      port: 3000,
      host: true, // Permite acesso externo
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    
    // Performance optimizations
    optimizeDeps: {
      include: ['@mui/material', '@mui/icons-material', 'react-router-dom'],
    },
  }
})
