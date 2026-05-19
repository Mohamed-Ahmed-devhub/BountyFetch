// ===================================================
// scrapingJob.js - مهام الخلفية الدورية
// يشغل الـ Scrapers كل فترة زمنية محددة
// ===================================================
const Bull = require('bull')
const { scrapeRSSFeeds }     = require('../services/scrapers/rssFeedScraper')
const { startTelegramScraper } = require('../services/scrapers/telegramScraper')

// إنشاء قائمة المهام (Queue)
const scrapingQueue = new Bull('scraping', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
})

function initQueues() {
  // بدء تشغيل بوت تيليجرام (يعمل دائماً)
  startTelegramScraper()

  // جدولة RSS scraping كل 10 دقائق
  scrapingQueue.add('rss', {}, {
    repeat:   { cron: '*/10 * * * *' }, // كل 10 دقائق
    attempts: 3,
  })

  // معالج مهام الـ RSS
  scrapingQueue.process('rss', async (job) => {
    console.log('⚙️ بدء جلسة RSS scraping...')
    await scrapeRSSFeeds()
    console.log('✅ انتهت جلسة RSS scraping')
  })

  // تشغيل فوري عند بدء السيرفر
  scrapingQueue.add('rss', {})

  console.log('⚙️ نظام الـ Queue يعمل')
}

module.exports = { initQueues }
