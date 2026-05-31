<<<<<<< HEAD
=======
// ملف إعداد Vite - أداة البناء والتطوير السريع
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
<<<<<<< HEAD
    alias: {
      '@':         path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages':    path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks':    path.resolve(__dirname, './src/hooks'),
      '@context':  path.resolve(__dirname, './src/context'),
      '@data':     path.resolve(__dirname, './src/data'),
=======
    // اختصارات المسارات لتسهيل الـ imports داخل المشروع
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    },
  },
  server: {
    port: 5173,
<<<<<<< HEAD
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } },
=======
    // توجيه طلبات الـ API للـ Backend تلقائياً أثناء التطوير
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
  },
})
