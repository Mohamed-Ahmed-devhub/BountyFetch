// ===== مُقرِّب Reddit =====
// يستخدم Reddit JSON API (مجاني بدون مفتاح) لقراءة subreddits محددة
// المصادر: r/forhire, r/webdev, r/css, r/javascript
// TODO (الأسبوع 3): تفعيل الجلب الفعلي

import axios from 'axios'

const SUBREDDITS = ['forhire', 'webdev', 'css', 'javascript']

export async function scrapeReddit() {
  const allPosts = []

  for (const subreddit of SUBREDDITS) {
    try {
      // Reddit يوفر JSON API مجاني بدون أي مفتاح
      const { data } = await axios.get(
        `https://www.reddit.com/r/${subreddit}/new.json?limit=10`,
        { headers: { 'User-Agent': 'TaskBountyAgent/1.0' } }
      )

      const posts = data.data.children.map(p => ({
        source: 'reddit',
        subreddit,
        rawText: `${p.data.title}\n${p.data.selftext}`,
        url: `https://reddit.com${p.data.permalink}`,
        postedAt: new Date(p.data.created_utc * 1000)
      }))

      allPosts.push(...posts)
    } catch (error) {
      console.error(`خطأ في جلب r/${subreddit}:`, error.message)
    }
  }

  return allPosts
}
// سيتم بناء هذا الـ scraper في الأسبوع الثاني
