// ===================================================
// Footer.jsx - تذييل الصفحة البسيط
// ===================================================
import React from 'react'

function Footer() {
  return (
    <footer className="border-t border-brand-border py-6 text-center">
      <p className="text-gray-600 text-sm">
        صُنع بـ ❤️ كمشروع تخرج احترافي — {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
