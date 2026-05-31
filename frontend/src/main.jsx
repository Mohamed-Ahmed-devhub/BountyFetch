<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n.js'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
)
