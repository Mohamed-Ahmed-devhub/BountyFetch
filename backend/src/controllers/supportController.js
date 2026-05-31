// ===================================================
// supportController.js — Pillar 5: Support Ticket System
// المسار: backend/src/controllers/supportController.js
// ===================================================

const { prisma } = require('../config/database')

// ── إرسال تذكرة دعم ──
exports.createTicket = async (req, res, next) => {
  try {
    const { type, title, description, screenshot } = req.body

    if (!type || !title || !description) {
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول المطلوبة' })
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId:      req.userId,
        type,
        title,
        description,
        screenshot:  screenshot || null,
        status:      'open',
      },
    })

    // ── DevOps Alert: إرسال لـ Telegram Bot إذا كان موجوداً ──
    sendTelegramAlert(ticket, req.userId).catch(e =>
      console.warn('⚠️  Telegram alert failed:', e.message)
    )

    res.status(201).json({ message: 'تم استلام تذكرتك بنجاح', ticket })
  } catch (e) { next(e) }
}

// ── جلب تذاكر المستخدم ──
exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where:   { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ tickets })
  } catch (e) { next(e) }
}

// ── Telegram Alert (async — لا يعيق الاستجابة) ──
async function sendTelegramAlert(ticket, userId) {
  const token   = process.env.TELEGRAM_BOT_TOKEN
  const chatId  = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId || token === 'disabled') return

  const typeEmoji = {
    bug:        '🐛',
    suggestion: '💡',
    report:     '🚩',
    other:      '📩',
  }

  const text = `
${typeEmoji[ticket.type] || '📩'} *تذكرة دعم جديدة*

🆔 *ID:* \`${ticket.id}\`
📋 *النوع:* ${ticket.type}
📌 *العنوان:* ${ticket.title}
👤 *المستخدم:* ${userId}
📝 *التفاصيل:*
${ticket.description.slice(0, 500)}
${ticket.screenshot ? `\n🖼 *لقطة شاشة:* ${ticket.screenshot}` : ''}

⏰ ${new Date().toLocaleString('ar-EG')}
  `.trim()

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })
}
