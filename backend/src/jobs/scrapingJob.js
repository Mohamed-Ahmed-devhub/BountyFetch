// ===================================================
// scrapingJob.js — مهام الخلفية الدورية بـ Bull Queue
// يشغل الـ Scrapers كل فترة زمنية محددة في الخلفية
// المسار: backend/src/jobs/scrapingJob.js
// ===================================================

const Bull = require('bull')
const { scrapeRSSFeeds }      = require('../services/scrapers/rssFeedScraper')
const { startTelegramScraper } = require('../services/scrapers/telegramScraper')

// ── إنشاء قائمة الانتظار ──
const scrapingQueue = new Bull('bountyfetch-scraping', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  defaultJobOptions: {
    attempts:    3,                          // إعادة المحاولة 3 مرات عند الفشل
    backoff:     { type: 'exponential', delay: 5000 }, // انتظار متزايد بين المحاولات
    removeOnComplete: 50,                    // الاحتفاظ بآخر 50 عملية ناجحة فقط
    removeOnFail: 20,                        // الاحتفاظ بآخر 20 عملية فاشلة
  },
})

/**
 * يهيئ ويشغل كل مهام الخلفية
 * يُستدعى مرة واحدة عند بدء تشغيل السيرفر
 */
function initQueues() {
  console.log('⚙️  تهيئة نظام مهام الخلفية (Bull Queue)...')

  // ── 1. بوت تيليجرام (يعمل دائماً — ليس في Queue) ──
  startTelegramScraper()

  // ── 2. RSS Scraping كل 10 دقائق ──
  scrapingQueue.add(
    'rss-scrape',
    { source: 'all' },
    {
      repeat: {
        cron: '*/10 * * * *', // كل 10 دقائق
      },
    }
  )

  // ── تشغيل فوري عند بدء السيرفر ──
  scrapingQueue.add('rss-scrape', { source: 'all', immediate: true })

  // ── معالج مهمة RSS ──
  scrapingQueue.process('rss-scrape', async (job) => {
    console.log(`\n🔄 [Queue] بدء جلسة RSS Scraping... (المحاولة ${job.attemptsMade + 1})`)

    try {
      const newCount = await scrapeRSSFeeds()
      const result   = { newTasks: newCount, completedAt: new Date().toISOString() }
      console.log(`✅ [Queue] RSS انتهى — ${newCount} مهمة جديدة`)
      return result
    } catch (error) {
      console.error('❌ [Queue] فشلت جلسة RSS:', error.message)
      throw error // إعادة رمي الخطأ ليعيد Bull المحاولة
    }
  })

  // ── أحداث Queue للمراقبة ──
  scrapingQueue.on('completed', (job, result) => {
    if (result?.newTasks > 0) {
      console.log(`📊 [Queue] ${job.name} أضاف ${result.newTasks} مهمة جديدة`)
    }
  })

  scrapingQueue.on('failed', (job, err) => {
    console.error(`❌ [Queue] ${job.name} فشل (محاولة ${job.attemptsMade}):`, err.message)
  })

  scrapingQueue.on('stalled', (job) => {
    console.warn(`⚠️  [Queue] ${job.name} توقفت — ستُعاد`)
  })

  console.log('✅ نظام مهام الخلفية يعمل')
}

/**
 * إيقاف Queue بشكل نظيف عند إغلاق السيرفر
 */
async function stopQueues() {
  await scrapingQueue.close()
  console.log('🔴 Queue أوقفت بنجاح')
}

module.exports = { initQueues, stopQueues, scrapingQueue }
