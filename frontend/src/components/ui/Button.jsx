// ===================================================
// Button.jsx - زر قابل لإعادة الاستخدام في كل المشروع
// ===================================================
import React from 'react'

// variant: 'primary' | 'secondary' | 'ghost' | 'danger'
// size: 'sm' | 'md' | 'lg'
function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  // أنماط الأحجام
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }

  // أنماط الأنواع
  const variants = {
    primary:   'bg-brand-cyan text-brand-dark font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] transition-all',
    secondary: 'border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 transition-all',
    ghost:     'text-gray-400 hover:text-white hover:bg-white/5 transition-all',
    danger:    'bg-neon-red text-white hover:shadow-[0_0_20px_rgba(255,51,102,0.6)] transition-all',
  }

  return (
    <button
      className={`
        rounded-lg font-semibold inline-flex items-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]} ${variants[variant]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* مؤشر التحميل */}
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
