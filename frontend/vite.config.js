// ===================================================
// vite.config.js — إعداد Vite
// المسار: frontend/vite.config.js
// ===================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './src'),
      '@components':  path.resolve(__dirname, './src/components'),
      '@pages':       path.resolve(__dirname, './src/pages'),
      '@services':    path.resolve(__dirname, './src/services'),
      '@hooks':       path.resolve(__dirname, './src/hooks'),
      '@utils':       path.resolve(__dirname, './src/utils'),
      '@context':     path.resolve(__dirname, './src/context'),
      '@locales':     path.resolve(__dirname, './src/locales'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
