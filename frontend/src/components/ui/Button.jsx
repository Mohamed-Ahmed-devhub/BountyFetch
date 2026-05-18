// ===== مكوّن الزر القابل لإعادة الاستخدام =====
// يُستخدم في كل مكان بالتطبيق مع تنويعات مختلفة
// variant: 'primary' (سايان) | 'secondary' (بنفسجي) | 'ghost' (شفاف)

function Button({ children, variant = 'primary', onClick, disabled = false, className = '' }) {
  // تحديد الألوان بناءً على نوع الزر
  const variants = {
    primary:   'bg-neon-cyan text-dark-bg hover:opacity-90',
    secondary: 'bg-neon-purple text-white hover:opacity-90',
    ghost:     'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-2.5 rounded-lg font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button
