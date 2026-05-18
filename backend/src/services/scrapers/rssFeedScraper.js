// ===== مُقرِّب RSS Feeds =====
// يقرأ تحديثات منصات الفريلانس عبر RSS (قانوني 100%)
// المصادر: Upwork, Freelancer, PeoplePerHour
// TODO (الأسبوع 4): إضافة المزيد من المصادر وفلترة التخصصات

import Parser from 'rss-parser'

const parser = new Parser()

// روابط RSS لمنصات الفريلانس - ستُحدَّث لاحقاً
const RSS_FEEDS = [
  { name: 'Upwork - Web Design', url: 'https://www.upwork.com/ab/feed/jobs/rss?q=css+responsive&sort=recency' },
  // TODO: إضافة المزيد من الروابط
]

export async function scrapeRSSFeeds() {
  const allItems = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)

      const items = parsed.items.map(item => ({
        source:    feed.name,
        rawText:   `${item.title}\n${item.contentSnippet || ''}`,
        url:       item.link,
        postedAt:  new Date(item.pubDate)
      }))

      allItems.push(...items)
    } catch (error) {
      console.error(`خطأ في جلب ${feed.name}:`, error.message)
    }
  }

  return allItems
}
