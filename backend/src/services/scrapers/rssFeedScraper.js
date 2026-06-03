// rssFeedScraper.js — RSS feed scraping (Reddit r/forhire, r/webdev, r/learnprogramming)
const Parser                   = require('rss-parser')
const { prisma }               = require('../../config/database')
const { broadcastTask }        = require('../../config/socket')
const { isTaskPost, extractTaskData } = require('../aiService')

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'BountyFetch/1.0 (RSS Reader; contact@bountyfetch.com)',
    'Accept':     'application/rss+xml, application/xml, text/xml',
  },
})

const RSS_FEEDS = [
  { url: 'https://www.reddit.com/r/forhire/new/.rss',         source: 'reddit', label: 'r/forhire' },
  { url: 'https://www.reddit.com/r/webdev/new/.rss',          source: 'reddit', label: 'r/webdev' },
  { url: 'https://www.reddit.com/r/learnprogramming/new/.rss', source: 'reddit', label: 'r/learnprogramming' },
]

async function scrapeRSSFeeds() {
  console.log(`🔄 [RSS] Starting scan of ${RSS_FEEDS.length} feeds...`)
  let totalNew = 0

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      const items  = (parsed.items || []).slice(0, 15)

      for (const item of items) {
        const result = await processRSSItem(item, feed.source)
        if (result) totalNew++
      }
      console.log(`✅ [RSS] ${feed.label}: processed`)
    } catch (error) {
      console.error(`❌ [RSS] Error in ${feed.label}:`, error.message)
    }
  }

  console.log(`📊 [RSS] Session done — ${totalNew} new tasks`)
  return totalNew
}

async function processRSSItem(item, source) {
  const title    = item.title   || ''
  const content  = item.contentSnippet || item.summary || item.content || ''
  const fullText = `${title}\n${content}`.trim()

  if (fullText.length < 20) return false

  const externalId = `rss_${source}_${item.guid || item.link || item.id || title}`

  try {
    const existing = await prisma.task.findUnique({ where: { externalId } })
    if (existing) return false
  } catch { /* continue */ }

  const isTask = await isTaskPost(fullText)
  if (!isTask) return false

  const taskData = await extractTaskData(fullText, source)

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
    broadcastTask(savedTask)
    console.log(`  🎯 [${source}] ${savedTask.title.slice(0, 60)}`)
    return true
  } catch (error) {
    if (!error.message?.includes('Unique')) {
      console.error(`  ❌ [${source}] Save error:`, error.message)
    }
    return false
  }
}

module.exports = { scrapeRSSFeeds }
