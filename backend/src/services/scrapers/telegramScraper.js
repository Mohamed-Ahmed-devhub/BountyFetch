// ===================================================
// telegramScraper.js - جمع المهام من قنوات تيليجرام
// يستخدم Telegram Bot API القانوني
// ===================================================
const { Telegraf } = require('telegraf')
const { prisma }   = require('../../config/database')
const { broadcastTask } = require('../../config/socket')
const filterService    = require('../filterService')

let bot = null

async function startTelegramScraper() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('⚠️ لا يوجد TELEGRAM_BOT_TOKEN - تخطي تيليجرام')
    return
  }

  bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

  // الاستماع لكل رسالة ترد على البوت أو في القنوات
  bot.on('message', async (ctx) => {
    const text = ctx.message.text || ''
    if (!text) return

    // فلترة ذكية: هل هذه الرسالة تحتوي على طلب عمل؟
    const isTask = await filterService.isTaskPost(text)
    if (!isTask) return

    // استخراج بيانات المهمة
    const taskData = await filterService.extractTaskData(text, 'telegram')
    
    try {
      // حفظ المهمة في قاعدة البيانات
      const savedTask = await prisma.task.upsert({
        where:  { externalId: String(ctx.message.message_id) },
        update: {},
        create: {
          externalId:  String(ctx.message.message_id),
          title:       taskData.title,
          description: text,
          skills:      taskData.skills,
          budget:      taskData.budget,
          source:      'telegram',
          url:         `https://t.me/${ctx.chat.username}/${ctx.message.message_id}`,
        },
      })

      // إرسال المهمة الجديدة لكل المستخدمين المتصلين
      broadcastTask(savedTask)
      console.log(`✅ مهمة تيليجرام جديدة: ${savedTask.title}`)
    } catch (error) {
      console.error('خطأ في حفظ مهمة تيليجرام:', error.message)
    }
  })

  bot.launch()
  console.log('📡 تيليجرام سكرابر يعمل')
}

module.exports = { startTelegramScraper }
