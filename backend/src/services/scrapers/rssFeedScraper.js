// ===================================================
<<<<<<< HEAD
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
=======
// rssFeedScraper.js - جمع المهام من RSS Feeds
// يستخدم RSS Feeds القانونية من منصات الفريلانس
// ===================================================
const Parser = require('rss-parser')
const { prisma }     = require('../../config/database')
const { broadcastTask } = require('../../config/socket')
const filterService  = require('../filterService')

const parser = new Parser()

// قنوات RSS للمنصات الكبيرة
const RSS_FEEDS = [
  {
    url:    'https://www.reddit.com/r/forhire/new/.rss',
    source: 'reddit',
  },
  {
    url:    'https://www.reddit.com/r/webdev/new/.rss',
    source: 'reddit',
  },
]

async function scrapeRSSFeeds() {
  console.log('🔄 جاري فحص RSS Feeds...')
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
<<<<<<< HEAD
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
=======
      
      for (const item of parsed.items.slice(0, 10)) { // آخر 10 مقالات فقط
        const text = `${item.title} ${item.contentSnippet || ''}`
        
        const isTask = await filterService.isTaskPost(text)
        if (!isTask) continue

        const taskData = await filterService.extractTaskData(text, feed.source)

        await prisma.task.upsert({
          where:  { externalId: item.guid || item.link },
          update: {},
          create: {
            externalId:  item.guid || item.link,
            title:       item.title,
            description: item.contentSnippet || item.title,
            skills:      taskData.skills,
            budget:      taskData.budget,
            source:      feed.source,
            url:         item.link,
            postedAt:    new Date(item.pubDate || Date.now()),
          },
        })
      }

      console.log(`✅ RSS ${feed.source}: تمت المعالجة`)
    } catch (error) {
      console.error(`❌ خطأ في RSS ${feed.url}:`, error.message)
    }
  }
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}

module.exports = { scrapeRSSFeeds }
