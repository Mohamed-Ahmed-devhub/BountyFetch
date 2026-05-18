// ملف إعدادات Vite - أداة البناء الأسرع لـ React
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // إعادة توجيه طلبات الـ API للـ Backend أثناء التطوير
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      }
    }
  }
})
