// ===================================================
// CodeShield.jsx - صفحة درع الكود (الشات بوت)
// ===================================================
import React from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import ChatWindow from '../components/chatbot/ChatWindow.jsx'

function CodeShield() {
  return (
    <div className="page-container flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <ChatWindow />
      </div>
    </div>
  )
}

export default CodeShield
