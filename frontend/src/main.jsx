// ===================================================
// main.jsx — نقطة الدخول الرئيسية للتطبيق
// يهيئ React + مكتبة الترجمة i18next
// المسار: frontend/src/main.jsx
// ===================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n.js'           // تهيئة الترجمة قبل أي شيء آخر
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
