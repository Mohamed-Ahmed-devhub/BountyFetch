// ===================================================
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

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      
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
}

module.exports = { scrapeRSSFeeds }
