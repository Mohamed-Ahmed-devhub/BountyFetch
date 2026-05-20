// ===================================================
// CodeShield.jsx — صفحة درع الكود (Code Shield)
// شات بوت ذكي متخصص في تصحيح الكود ومشاكل CSS
// المسار: frontend/src/pages/CodeShield.jsx
// ===================================================

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import { aiService } from '../services/aiService.js'
import { useLanguage } from '../context/LanguageContext.jsx'

// ─── الرسائل الترحيبية ───
const WELCOME = {
  ar: `مرحباً! أنا **درع الكود** من BountyFetch 🛡️

أستطيع مساعدتك في:
• **تصحيح أخطاء الكود** — JavaScript, HTML, CSS
• **إصلاح مشاكل Responsive** وتوافق الموبايل
• **شرح الكود** بطريقة بسيطة وواضحة
• **تحسين جودة الكود** قبل تسليمه للعميل

الصق كودك أو اشرح المشكلة وسأساعدك فوراً!`,

  en: `Hello! I'm **Code Shield** by BountyFetch 🛡️

I can help you with:
• **Code debugging** — JavaScript, HTML, CSS
• **Responsive issues** and mobile compatibility
• **Code explanation** in simple terms
• **Code quality improvements** before client delivery

Paste your code or describe the problem and I'll help immediately!`
}

// ─── أمثلة أسئلة سريعة ───
const QUICK_PROMPTS = {
  ar: [
    'لماذا لا يعمل Flexbox على الموبايل؟',
    'كيف أصلح z-index لا يعمل؟',
    'مشكلة في querySelector لا يجد العنصر',
    'كيف أجعل الصورة Responsive بشكل صحيح؟',
  ],
  en: [
    'Why is my Flexbox not working on mobile?',
    'How to fix z-index not working?',
    'querySelector returning null issue',
    'How to make images properly responsive?',
  ],
}

export default function CodeShield() {
  const { isRTL, language } = useLanguage()

  const [messages, setMessages]   = useState([
    { role: 'assistant', content: WELCOME[language] || WELCOME.ar, isWelcome: true }
  ])
  const [input, setInput]         = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)

  // تمرير للأسفل عند كل رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // إرسال الرسالة
  const sendMessage = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // إعادة ضبط ارتفاع الـ textarea
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const history = messages
        .filter(m => !m.isWelcome)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await aiService.sendChatMessage(trimmed, history)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isRTL
          ? '⚠️ حدث خطأ في الاتصال. تحقق من الشبكة وحاول مجدداً.'
          : '⚠️ Connection error. Check your network and try again.',
        isError: true,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Enter للإرسال، Shift+Enter لسطر جديد
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ضبط ارتفاع الـ textarea تلقائياً
  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME[language] || WELCOME.ar, isWelcome: true }])
  }

  return (
    <div className="cs-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="cs-layout">

        {/* ══════════════════════════════
            اللوحة الجانبية — معلومات
        ══════════════════════════════ */}
        <aside className="cs-sidebar">
          <div className="cs-sidebar-inner">

            <div className="cs-shield-logo">
              <span className="cs-shield-icon">🛡️</span>
              <div>
                <p className="cs-shield-title">Code Shield</p>
                <p className="cs-shield-sub">by BountyFetch</p>
              </div>
            </div>

            <div className="cs-capabilities">
              <p className="cs-cap-label">{isRTL ? 'القدرات' : 'Capabilities'}</p>
              {[
                { icon: '🐛', ar: 'تصحيح الأخطاء', en: 'Bug Debugging' },
                { icon: '📱', ar: 'إصلاح Responsive', en: 'Responsive Fixes' },
                { icon: '💅', ar: 'تحسين CSS', en: 'CSS Improvements' },
                { icon: '⚡', ar: 'تحسين الأداء', en: 'Performance Tips' },
                { icon: '📖', ar: 'شرح الكود', en: 'Code Explanation' },
              ].map((c, i) => (
                <div key={i} className="cs-cap-item">
                  <span>{c.icon}</span>
                  <span>{isRTL ? c.ar : c.en}</span>
                </div>
              ))}
            </div>

            <button className="cs-clear-btn" onClick={clearChat}>
              {isRTL ? '🗑 مسح المحادثة' : '🗑 Clear Chat'}
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════
            منطقة الشات الرئيسية
        ══════════════════════════════ */}
        <div className="cs-chat-area">

          {/* ─── الرسائل ─── */}
          <div className="cs-messages">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .25 }}
                  className={`cs-msg ${msg.role === 'user' ? 'cs-msg-user' : 'cs-msg-bot'}`}
                >
                  {/* أيقونة المرسل */}
                  {msg.role === 'assistant' && (
                    <div className="cs-bot-avatar">🛡️</div>
                  )}

                  {/* محتوى الرسالة */}
                  <div className={`cs-bubble ${msg.role === 'user' ? 'cs-bubble-user' : 'cs-bubble-bot'} ${msg.isError ? 'cs-bubble-error' : ''}`}>
                    <MessageContent content={msg.content} />
                  </div>

                  {msg.role === 'user' && (
                    <div className="cs-user-avatar">👤</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* مؤشر الكتابة */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="cs-msg cs-msg-bot"
              >
                <div className="cs-bot-avatar">🛡️</div>
                <div className="cs-bubble cs-bubble-bot">
                  <div className="cs-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ─── الأسئلة السريعة ─── */}
          {messages.length <= 1 && (
            <div className="cs-quick-prompts">
              <p className="cs-quick-label">
                {isRTL ? 'أسئلة شائعة:' : 'Common questions:'}
              </p>
              <div className="cs-quick-list">
                {(QUICK_PROMPTS[language] || QUICK_PROMPTS.ar).map((q, i) => (
                  <button
                    key={i}
                    className="cs-quick-btn"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── منطقة الإدخال ─── */}
          <div className="cs-input-area">
            <div className="cs-input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={isRTL
                  ? 'الصق كودك أو اشرح المشكلة... (Enter للإرسال، Shift+Enter لسطر جديد)'
                  : 'Paste your code or describe the issue... (Enter to send, Shift+Enter for new line)'}
                rows={1}
                className="cs-textarea"
                disabled={isLoading}
              />
              <button
                className="cs-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label={isRTL ? 'إرسال' : 'Send'}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="cs-input-hint">
              {isRTL
                ? 'Enter للإرسال · Shift+Enter لسطر جديد · يدعم الكود والنص'
                : 'Enter to send · Shift+Enter for new line · Supports code & text'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .cs-root {
          --cs-bg:      #020617;
          --cs-surface: #0f172a;
          --cs-panel:   #0d1526;
          --cs-border:  #1e293b;
          --cs-bl:      #334155;
          --cs-royal:   #2563eb;
          --cs-rlt:     #3b82f6;
          --cs-sky:     #0ea5e9;
          --cs-text:    #f1f5f9;
          --cs-muted:   #94a3b8;
          --cs-subtle:  #475569;

          min-height: 100vh;
          background: var(--cs-bg);
          color: var(--cs-text);
          font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
          display: flex;
          flex-direction: column;
        }

        .cs-layout {
          flex: 1;
          display: flex;
          height: calc(100vh - 64px);
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .cs-sidebar {
          width: 220px;
          flex-shrink: 0;
          border-inline-end: 1px solid var(--cs-border);
          background: var(--cs-panel);
          overflow-y: auto;
        }
        @media (max-width: 768px) { .cs-sidebar { display: none; } }
        .cs-sidebar-inner {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }

        .cs-shield-logo {
          display: flex; align-items: center; gap: .65rem;
        }
        .cs-shield-icon { font-size: 1.75rem; }
        .cs-shield-title {
          font-family: 'Syne',system-ui,sans-serif;
          font-size: .95rem; font-weight: 800;
          color: var(--cs-rlt); margin: 0;
        }
        .cs-shield-sub { font-size: .68rem; color: var(--cs-subtle); margin: 0; }

        .cs-capabilities { display: flex; flex-direction: column; gap: .85rem; }
        .cs-cap-label {
          font-size: .65rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--cs-subtle);
        }
        .cs-cap-item {
          display: flex; align-items: center; gap: .55rem;
          font-size: .78rem; color: var(--cs-muted);
        }

        .cs-clear-btn {
          font-size: .78rem; font-weight: 600;
          color: var(--cs-subtle);
          background: none;
          border: 1px solid var(--cs-border);
          border-radius: 8px;
          padding: .5rem .75rem;
          cursor: pointer;
          transition: color .2s, border-color .2s;
          text-align: start;
          margin-top: auto;
        }
        .cs-clear-btn:hover { color: #f87171; border-color: rgba(248,113,113,.3); }

        /* ── Chat Area ── */
        .cs-chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* الرسائل */
        .cs-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cs-messages::-webkit-scrollbar { width: 4px; }
        .cs-messages::-webkit-scrollbar-thumb {
          background: var(--cs-border); border-radius: 2px;
        }

        .cs-msg {
          display: flex;
          align-items: flex-end;
          gap: .6rem;
          max-width: 85%;
        }
        .cs-msg-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .cs-msg-bot { align-self: flex-start; }

        .cs-bot-avatar, .cs-user-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .cs-bot-avatar {
          background: rgba(37,99,235,.15);
          border: 1px solid rgba(37,99,235,.25);
        }
        .cs-user-avatar {
          background: rgba(14,165,233,.1);
          border: 1px solid rgba(14,165,233,.2);
        }

        .cs-bubble {
          padding: .85rem 1.1rem;
          border-radius: 16px;
          font-size: .875rem;
          line-height: 1.7;
          max-width: 100%;
          word-break: break-word;
        }
        .cs-bubble-user {
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #fff;
          border-bottom-inline-end-radius: 4px;
        }
        .cs-bubble-bot {
          background: var(--cs-surface);
          border: 1px solid var(--cs-border);
          color: var(--cs-text);
          border-bottom-inline-start-radius: 4px;
        }
        .cs-bubble-error {
          background: rgba(248,113,113,.08) !important;
          border-color: rgba(248,113,113,.25) !important;
          color: #fca5a5 !important;
        }

        /* مؤشر الكتابة */
        .cs-typing {
          display: flex; gap: 4px; padding: .15rem 0;
        }
        .cs-typing span {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--cs-rlt);
          animation: csTyping 1.2s ease-in-out infinite;
        }
        .cs-typing span:nth-child(2) { animation-delay: .2s; }
        .cs-typing span:nth-child(3) { animation-delay: .4s; }
        @keyframes csTyping {
          0%,80%,100% { transform: scale(.6); opacity: .35; }
          40%           { transform: scale(1); opacity: 1; }
        }

        /* الأسئلة السريعة */
        .cs-quick-prompts {
          padding: 0 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: .6rem;
        }
        .cs-quick-label {
          font-size: .72rem; font-weight: 600;
          letter-spacing: .06em; text-transform: uppercase;
          color: var(--cs-subtle); margin: 0;
        }
        .cs-quick-list {
          display: flex; flex-wrap: wrap; gap: .4rem;
        }
        .cs-quick-btn {
          font-size: .78rem; font-weight: 500;
          padding: .38rem .85rem;
          border-radius: 99px;
          border: 1px solid var(--cs-border);
          background: transparent;
          color: var(--cs-muted);
          cursor: pointer;
          transition: all .2s;
          text-align: start;
        }
        .cs-quick-btn:hover {
          border-color: var(--cs-rlt);
          color: var(--cs-text);
          background: rgba(59,130,246,.06);
        }

        /* منطقة الإدخال */
        .cs-input-area {
          padding: 1rem 1.5rem 1.25rem;
          border-top: 1px solid var(--cs-border);
          display: flex;
          flex-direction: column;
          gap: .5rem;
          background: rgba(15,23,42,.6);
          backdrop-filter: blur(10px);
        }
        .cs-input-box {
          display: flex;
          align-items: flex-end;
          gap: .6rem;
          background: var(--cs-surface);
          border: 1px solid var(--cs-border);
          border-radius: 14px;
          padding: .5rem .5rem .5rem .9rem;
          transition: border-color .2s;
        }
        .cs-input-box:focus-within { border-color: rgba(59,130,246,.5); }
        .cs-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--cs-text);
          font-size: .875rem;
          line-height: 1.6;
          resize: none;
          font-family: inherit;
          max-height: 160px;
          padding: .4rem 0;
        }
        .cs-textarea::placeholder { color: var(--cs-subtle); }
        .cs-textarea:disabled { opacity: .5; }
        .cs-send-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, var(--cs-royal), var(--cs-sky));
          color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all .2s;
        }
        .cs-send-btn:hover:not(:disabled) {
          box-shadow: 0 4px 15px rgba(37,99,235,.4);
          transform: translateY(-1px);
        }
        .cs-send-btn:disabled { opacity: .4; cursor: not-allowed; }

        .cs-input-hint {
          font-size: .68rem;
          color: var(--cs-subtle);
          margin: 0;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

// ─── عرض محتوى الرسالة مع دعم الكود ───
function MessageContent({ content }) {
  // تقسيم الكود من النص العادي
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines    = part.slice(3, -3).split('\n')
          const lang     = lines[0].trim()
          const codeBody = lines.slice(1).join('\n').trim()
          return (
            <pre key={i} style={{
              background: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '.85rem 1rem',
              overflowX: 'auto',
              fontSize: '.78rem',
              lineHeight: 1.7,
              fontFamily: "'JetBrains Mono','Fira Code',monospace",
              color: '#e2e8f0',
              margin: '.5rem 0',
            }}>
              {lang && <span style={{ color: '#64748b', fontSize: '.65rem', display: 'block', marginBottom: '.4rem' }}>{lang}</span>}
              <code>{codeBody || part.slice(3, -3)}</code>
            </pre>
          )
        }
        // نص عادي مع دعم **bold**
        return (
          <span key={i} style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.3);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.85em">$1</code>')
            }}
          />
        )
      })}
    </div>
  )
}
