// ===== فقاعة الرسالة الواحدة في المحادثة =====
// تعرض الرسالة مع تمييز بصري بين رسائل المستخدم والـ AI
// message: { role: 'user' | 'assistant', text: string }

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? 'bg-neon-purple text-white rounded-ee-sm'
          : 'bg-dark-card border border-dark-border text-gray-300 rounded-es-sm'
        }
      `}>
        {/* أيقونة الـ AI للردود */}
        {!isUser && <span className="text-neon-cyan me-1">🛡️</span>}
        {message.text}
      </div>
    </div>
  )
}

export default MessageBubble
