// ===== نقطة الدخول الرئيسية لتطبيق React =====
// هذا الملف يقوم بتحميل التطبيق بالكامل داخل عنصر div#root في index.html

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// سنضيف هنا لاحقاً: إعداد i18next للترجمة وReact Query للـ API

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
