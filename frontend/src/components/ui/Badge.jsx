// ===== مكوّن الشارة الصغيرة =====
// يُستخدم لعرض: نوع المهمة، المصدر، المهارة المطلوبة
// color: 'cyan' | 'purple' | 'green' | 'gray'

function Badge({ children, color = 'cyan' }) {
  const colors = {
    cyan:   'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
    green:  'bg-neon-green/10 text-neon-green border-neon-green/30',
    gray:   'bg-gray-800 text-gray-400 border-gray-700',
  }

  return (
    <span className={`
      inline-block px-2.5 py-0.5 text-xs font-medium
      border rounded-full ${colors[color]}
    `}>
      {children}
    </span>
  )
}

export default Badge
