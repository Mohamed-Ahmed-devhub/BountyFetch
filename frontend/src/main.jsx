// ===================================================
// main.jsx - نقطة الدخول الرئيسية للتطبيق
// هنا نقوم بتهيئة كل المكتبات الأساسية وربطها بـ React
// ===================================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// تهيئة مكتبة الترجمة (i18next) قبل تشغيل التطبيق
import './i18n.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
