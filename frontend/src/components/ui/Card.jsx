// ===================================================
// Card.jsx - كرت زجاجي قابل لإعادة الاستخدام
// ===================================================
import React from 'react'

function Card({ children, className = '', glow = false }) {
  return (
    <div
      className={`
        glass-card p-5
        ${glow ? 'neon-border' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
