// ===================================================
// MessageBubble.jsx - فقاعة الرسالة في الشات
// ===================================================
import React from 'react'

function MessageBubble({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bg-brand-cyan text-brand-dark font-medium rounded-ee-sm'
            : 'bg-brand-surface border border-brand-border text-gray-300 rounded-es-sm'
          }
        `}
      >
        {/* عرض الكود بشكل خاص إذا كانت الرسالة تحتوي كود */}
        {content.includes('```') ? (
          <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
