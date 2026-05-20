// ===================================================
// rssFeedScraper.js — جمع المهام من RSS Feeds
// مصادر: Reddit (r/forhire, r/webdev) + مواقع عمل
// المسار: backend/src/services/scrapers/rssFeedScraper.js
// ===================================================

const Parser         = require('rss-parser')
const { prisma }     = require('../../config/database')
const { broadcastTask } = require('../../config/socket')
const { isTaskPost, extractTaskData } = require('../aiService')

const parser = new Parser({
  timeout: 10000,  // 10 ثواني حد أقصى للانتظار
  headers: {
    'User-Agent': 'BountyFetch/1.0 (RSS Reader; contact@bountyfetch.com)',
    'Accept':     'application/rss+xml, application/xml, text/xml',
  },
})

// ── قائمة RSS Feeds المراقبة ──
const RSS_FEEDS = [
  // Reddit — طلبات العمل والفريلانس
  {
    url:      'https://www.reddit.com/r/forhire/new/.rss',
    source:   'reddit',
    labelAr:  'Reddit - r/forhire',
  },
  {
    url:      'https://www.reddit.com/r/webdev/new/.rss',
    source:   'reddit',
    labelAr:  'Reddit - r/webdev',
  },
  {
    url:      'https://www.reddit.com/r/learnprogramming/new/.rss',
    source:   'reddit',
    labelAr:  'Reddit - r/learnprogramming',
  },
  // يمكن إضافة المزيد هنا لاحقاً مثل:
  // { url: 'https://remoteok.com/remote-jobs.rss', source: 'rss', labelAr: 'RemoteOK' },
]

/**
 * يجلب ويعالج كل RSS Feeds
 * يُستدعى من scrapingJob كل 10 دقائق
 */
async function scrapeRSSFeeds() {
  console.log(`🔄 [RSS] بدء جلسة فحص ${RSS_FEEDS.length} مصادر...`)
  let totalNew = 0

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      const items  = (parsed.items || []).slice(0, 15) // آخر 15 مقال فقط

      for (const item of items) {
        const processed = await processRSSItem(item, feed.source)
        if (processed) totalNew++
      }

      console.log(`✅ [RSS] ${feed.labelAr}: تمت المعالجة`)
    } catch (error) {
      console.error(`❌ [RSS] خطأ في ${feed.labelAr}:`, error.message)
      // نكمل بقية المصادر حتى لو فشل مصدر واحد
    }
  }

  console.log(`📊 [RSS] انتهت الجلسة — ${totalNew} مهمة جديدة`)
  return totalNew
}

/**
 * يعالج عنصر RSS واحد
 */
async function processRSSItem(item, source) {
  // بناء النص الكامل للفحص
  const title   = item.title   || ''
  const content = item.contentSnippet || item.summary || item.content || ''
  const fullText = `${title}\n${content}`.trim()

  if (fullText.length < 20) return false

  // المعرف الفريد
  const externalId = `rss_${source}_${item.guid || item.link || item.id || title}`

  // تحقق إذا كانت المهمة موجودة مسبقاً (بدون استدعاء AI)
  try {
    const existing = await prisma.task.findUnique({ where: { externalId } })
    if (existing) return false // موجود — تخطَّ
  } catch { /* تابع */ }

  // فلترة بالذكاء الاصطناعي
  const isTask = await isTaskPost(fullText)
  if (!isTask) return false

  // استخراج البيانات
  const taskData = await extractTaskData(fullText, source)

  // حفظ في قاعدة البيانات
  try {
    const savedTask = await prisma.task.create({
      data: {
        externalId,
        title:       taskData.title || title.slice(0, 120),
        description: content.slice(0, 1200),
        skills:      taskData.skills || [],
        budget:      taskData.budget,
        source,
        url:         item.link || null,
        postedAt:    item.pubDate ? new Date(item.pubDate) : new Date(),
      },
    })

    // إرسال للمستخدمين المتصلين
    broadcastTask(savedTask)
    console.log(`  🎯 [${source}] ${savedTask.title.slice(0, 60)}`)
    return true

  } catch (error) {
    if (!error.message?.includes('Unique')) {
      console.error(`  ❌ [${source}] خطأ في الحفظ:`, error.message)
    }
    return false
  }
}

module.exports = { scrapeRSSFeeds }
