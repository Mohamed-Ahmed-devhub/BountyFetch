// telegramScraper.js — Telegram bot scraper
const { Telegraf }             = require('telegraf')
const { prisma }               = require('../../config/database')
const { broadcastTask }        = require('../../config/socket')
const { isTaskPost, extractTaskData } = require('../aiService')

let bot = null

async function startTelegramScraper() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token || token === 'disabled' || token === 'your_telegram_bot_token_here') {
    console.log('⚠️  Telegram scraper disabled (no token)')
    return
  }

  try {
    bot = new Telegraf(token)

    bot.on('message',      async (ctx) => { await processMessage(ctx.message,      ctx.chat) })
    bot.on('channel_post', async (ctx) => { await processMessage(ctx.channelPost,  ctx.chat) })

    bot.launch()

    process.once('SIGINT',  () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    console.log('📡 Telegram scraper running')
  } catch (error) {
    console.error('❌ Telegram bot start failed:', error.message)
  }
}

async function processMessage(message, chat) {
  if (!message) return
  const text = message.text || message.caption || ''
  if (!text || text.length < 20) return

  const isTask = await isTaskPost(text)
  if (!isTask) return

  const source     = `telegram_${chat?.username || chat?.id || 'unknown'}`
  const externalId = `tg_${message.message_id}_${chat?.id || 'unknown'}`

  try {
    const existing = await prisma.task.findUnique({ where: { externalId } })
    if (existing) return
  } catch { return }

  const taskData = await extractTaskData(text, 'telegram')

  try {
    const savedTask = await prisma.task.create({
      data: {
        externalId,
        title:       taskData.title || text.slice(0, 120),
        description: text.slice(0, 1200),
        skills:      taskData.skills || [],
        budget:      taskData.budget,
        source:      'telegram',
        url:         chat?.username ? `https://t.me/${chat.username}/${message.message_id}` : null,
        postedAt:    message.date ? new Date(message.date * 1000) : new Date(),
      },
    })
    broadcastTask(savedTask)
    console.log(`  📨 [telegram] ${savedTask.title.slice(0, 60)}`)
  } catch (error) {
    if (!error.message?.includes('Unique')) {
      console.error('Telegram save error:', error.message)
    }
  }
}

module.exports = { startTelegramScraper }
