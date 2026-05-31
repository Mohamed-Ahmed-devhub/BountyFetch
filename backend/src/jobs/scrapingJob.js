// ===================================================
<<<<<<< HEAD
// scrapingJob.js — بدون Redis (setInterval بدلاً من Bull)
// المسار: backend/src/jobs/scrapingJob.js
// ===================================================

const { scrapeRSSFeeds } = require("../services/scrapers/rssFeedScraper");
const {
  startTelegramScraper,
} = require("../services/scrapers/telegramScraper");

function initQueues() {
  // تشغيل Telegram
  startTelegramScraper();

  // تشغيل RSS كل 10 دقائق
  setInterval(
    async () => {
      try {
        await scrapeRSSFeeds();
      } catch (e) {
        console.error("RSS Error:", e.message);
      }
    },
    10 * 60 * 1000,
  );

  // تشغيل فوري بعد 3 ثواني من بدء السيرفر
  setTimeout(async () => {
    try {
      await scrapeRSSFeeds();
    } catch (e) {
      console.error("RSS Error:", e.message);
    }
  }, 3000);

  console.log("✅ Queue يعمل بدون Redis");
}

async function stopQueues() {
  console.log("Queue أوقفت");
}

module.exports = { initQueues, stopQueues };
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
