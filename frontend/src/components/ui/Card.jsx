// ===== مكوّن البطاقة الأساسية =====
// تُستخدم لعرض المهام والمعلومات بشكل موحد في كل التطبيق
// glowing: تضيف تأثير التوهج النيون حول البطاقة

function Card({ children, glowing = false, className = '' }) {
  return (
    <div
      className={`
        bg-dark-card border border-dark-border rounded-xl p-4
        transition-all duration-300
        ${glowing ? 'neon-glow-cyan border-neon-cyan/30' : 'hover:border-neon-purple/50'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
