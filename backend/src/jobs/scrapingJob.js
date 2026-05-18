// ===== مهمة الـ Scraping الدورية =====
// تعمل كل 5 دقائق في الخلفية لجلب المهام الجديدة من كل المصادر
// تستخدم Bull Queue + Redis لجدولة المهام بشكل موثوق

import Bull from 'bull'
import { scrapeReddit }   from '../services/scrapers/redditScraper.js'
import { scrapeRSSFeeds } from '../services/scrapers/rssFeedScraper.js'
import { scrapeTelegram } from '../services/scrapers/telegramScraper.js'
import { scrapeTwitter }  from '../services/scrapers/twitterScraper.js'
import { classifyAndEnrichTask } from '../services/filterService.js'
import { notifyMatchingUsers }   from '../services/notificationService.js'
import prisma from '../config/database.js'

// إنشاء الـ Queue
export const scrapingQueue = new Bull('scraping', process.env.REDIS_URL)

// معالج المهمة: يعمل عند كل دورة
scrapingQueue.process(async (job) => {
  console.log(`🔍 بدء دورة الصيد #${job.id} - ${new Date().toLocaleTimeString('ar')}`)

  // 1. جلب البيانات الخام من كل المصادر
  const rawData = [
    ...await scrapeReddit(),
    ...await scrapeRSSFeeds(),
    ...await scrapeTelegram(),
    ...await scrapeTwitter(),
  ]

  console.log(`📦 تم جلب ${rawData.length} منشور خام`)

  // 2. تصنيف كل منشور بالـ AI
  for (const item of rawData) {
    const classified = await classifyAndEnrichTask(item.rawText, item.source)

    if (!classified.isTask) continue // تجاهل المنشورات غير المهمة

    // 3. حفظ المهمة في قاعدة البيانات
    try {
      const task = await prisma.task.create({
        data: {
          title:          classified.title,
          description:    classified.description,
          skills:         classified.skills || [],
          estimatedBudget: classified.estimatedBudget || 'غير محدد',
          source:         item.source,
          sourceUrl:      item.url || '',
          urgency:        classified.urgency || 'medium',
        }
      })

      // 4. إرسال إشعار real-time للمستخدمين المهتمين
      notifyMatchingUsers(task)
      console.log(`✅ مهمة جديدة: ${task.title}`)

    } catch (error) {
      // تجاهل الخطأ إذا كانت المهمة مكررة
      if (!error.message.includes('Unique')) {
        console.error(`خطأ في حفظ المهمة:`, error.message)
      }
    }
  }
})

// إضافة مهمة متكررة كل 5 دقائق
export function startScrapingSchedule() {
  scrapingQueue.add({}, {
    repeat: { cron: '*/5 * * * *' }, // كل 5 دقائق
    removeOnComplete: true,
  })
  console.log('⏰ جدول الصيد بدأ - كل 5 دقائق')
}
