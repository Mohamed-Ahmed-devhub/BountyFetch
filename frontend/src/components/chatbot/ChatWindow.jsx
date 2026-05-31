// ===================================================
// ChatWindow.jsx - نافذة الشات بوت (Code Shield)
// ===================================================
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { aiService } from '../../services/aiService.js'
import MessageBubble from './MessageBubble.jsx'

function ChatWindow() {
  const { t } = useTranslation()
  const [messages, setMessages]     = useState([])
  const [inputText, setInputText]   = useState('')
  const [isLoading, setIsLoading]   = useState(false)
  const messagesEndRef = useRef(null)

  // التمرير للأسفل تلقائياً عند كل رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage = { role: 'user', content: inputText }
    const updatedHistory = [...messages, userMessage]
    
    setMessages(updatedHistory)
    setInputText('')
    setIsLoading(true)

    try {
      const response = await aiService.sendChatMessage(inputText, messages)
      const aiMessage = { role: 'assistant', content: response.data.reply }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'حدث خطأ في الاتصال. تحقق من الاتصال بالإنترنت وحاول مجدداً.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // إرسال بضغط Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      {/* رأس الشات */}
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-brand-cyan font-bold">🛡️ {t('code_shield.title')}</h2>
        <p className="text-xs text-gray-500">{t('code_shield.subtitle')}</p>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            <span className="text-4xl block mb-2">🛡️</span>
            <p className="text-sm">أرسل كودك أو اشرح مشكلتك وسأساعدك</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        {/* مؤشر الكتابة */}
        {isLoading && (
          <div className="flex gap-1 ps-3">
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال */}
      <div className="p-4 border-t border-brand-border flex gap-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('code_shield.placeholder')}
          rows={2}
          className="flex-1 bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-sm text-gray-300 resize-none focus:outline-none focus:border-brand-cyan transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2 bg-brand-cyan text-brand-dark rounded-lg font-bold text-sm hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all self-end"
        >
          {t('code_shield.send')}
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
