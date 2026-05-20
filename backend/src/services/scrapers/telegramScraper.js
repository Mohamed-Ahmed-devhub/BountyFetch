// ===================================================
// telegramScraper.js — جمع المهام من تيليجرام
// يستخدم Telegram Bot API القانوني
// المسار: backend/src/services/scrapers/telegramScraper.js
// ===================================================

const { Telegraf }      = require('telegraf')
const { prisma }        = require('../../config/database')
const { broadcastTask } = require('../../config/socket')
const { isTaskPost, extractTaskData } = require('../aiService')

let bot = null

/**
 * يبدأ تشغيل بوت تيليجرام ويستمع للرسائل في القنوات
 */
async function startTelegramScraper() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('⚠️  TELEGRAM_BOT_TOKEN غير موجود — تم تخطي تيليجرام')
    return
  }

  try {
    bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

    // ── استماع لكل الرسائل ──
    bot.on('message', async (ctx) => {
      await processMessage(ctx.message, ctx.chat)
    })

    // استماع لمنشورات القنوات
    bot.on('channel_post', async (ctx) => {
      await processMessage(ctx.channelPost, ctx.chat)
    })

    // بدء البوت
    bot.launch()

    // إيقاف نظيف عند إغلاق السيرفر
    process.once('SIGINT',  () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    console.log('📡 Telegram Scraper يعمل — يراقب الرسائل')
  } catch (error) {
    console.error('❌ فشل تشغيل Telegram Bot:', error.message)
  }
}

/**
 * يعالج رسالة واحدة من تيليجرام
 */
async function processMessage(message, chat) {
  if (!message) return

  const text = message.text || message.caption || ''
  if (text.length < 30) return // رسائل قصيرة جداً لا تستحق الفلترة

  try {
    // فلترة بالذكاء الاصطناعي
    const isTask = await isTaskPost(text)
    if (!isTask) return

    // استخراج بيانات المهمة
    const taskData = await extractTaskData(text, 'telegram')

    // بناء الـ URL
    const chatUsername = chat?.username
    const messageId    = message.message_id
    const url = chatUsername
      ? `https://t.me/${chatUsername}/${messageId}`
      : null

    // حفظ في قاعدة البيانات (upsert يمنع التكرار)
    const savedTask = await prisma.task.upsert({
      where:  { externalId: `tg_${messageId}` },
      update: {},   // إذا موجود — لا تحدّث
      create: {
        externalId:  `tg_${messageId}`,
        title:       taskData.title,
        description: text.slice(0, 1000),
        skills:      taskData.skills || [],
        budget:      taskData.budget,
        source:      'telegram',
        url,
        postedAt:    new Date(message.date * 1000), // Telegram يرسل Unix timestamp
      },
    })

    // إرسال المهمة الجديدة لجميع المستخدمين المتصلين عبر WebSocket
    broadcastTask(savedTask)
    console.log(`✅ [Telegram] مهمة جديدة: ${savedTask.title.slice(0, 50)}`)

  } catch (error) {
    // تجاهل خطأ التكرار (Unique constraint)
    if (!error.message?.includes('Unique')) {
      console.error('❌ [Telegram] خطأ في معالجة الرسالة:', error.message)
    }
  }
}

/**
 * إيقاف بوت تيليجرام بشكل نظيف
 */
function stopTelegramScraper() {
  if (bot) {
    bot.stop()
    console.log('🔴 Telegram Bot أوقف')
  }
}

module.exports = { startTelegramScraper, stopTelegramScraper }
