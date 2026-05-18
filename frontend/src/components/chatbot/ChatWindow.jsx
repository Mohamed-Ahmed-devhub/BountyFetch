// ===== نافذة المحادثة الرئيسية للشات بوت =====
// تعرض: سجل الرسائل + حقل الإدخال + زر الإرسال
// TODO (الأسبوع 6): ربط Claude API للردود الذكية مع streaming

import { useState } from 'react'
import MessageBubble from './MessageBubble.jsx'

function ChatWindow() {
  // حالة قائمة الرسائل
  const [messages, setMessages] = useState([
    // رسالة ترحيبية أولية من الـ AI
    { id: 1, role: 'assistant', text: 'مرحباً! أنا درع الكود الذكي 🛡️ أرسل لي الكود الذي تواجه فيه مشكلة وسأساعدك في حلها.' }
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return
    // TODO: إضافة منطق الإرسال لـ Claude API
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: inputText }])
    setInputText('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* حقل الإدخال */}
      <div className="border-t border-dark-border p-4 flex gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب كودك أو سؤالك هنا..."
          className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan placeholder-gray-600"
        />
        <button
          onClick={handleSend}
          className="bg-neon-cyan text-dark-bg px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          إرسال
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
