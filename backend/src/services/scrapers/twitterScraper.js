// ===== مُقرِّب تويتر/X =====
// يستخدم Twitter API v2 للبحث عن تغريدات طلبات العمل
// تحتاج: Bearer Token من Twitter Developer Portal
// TODO (الأسبوع 4): تفعيل بعد الحصول على API Key

import axios from 'axios'

// كلمات البحث للعثور على طلبات عمل
const SEARCH_QUERIES = [
  'مطلوب مطور CSS -is:retweet',
  'need web developer CSS fix -is:retweet',
  'looking for frontend developer -is:retweet'
]

export async function scrapeTwitter() {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    console.log('⚠️  Twitter Bearer Token غير موجود - يتم تخطي هذا المصدر')
    return []
  }

  const allTweets = []

  for (const query of SEARCH_QUERIES) {
    try {
      const { data } = await axios.get(
        'https://api.twitter.com/2/tweets/search/recent',
        {
          params: { query, max_results: 10, 'tweet.fields': 'created_at' },
          headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
        }
      )

      if (data.data) {
        allTweets.push(...data.data.map(t => ({
          source: 'twitter',
          rawText: t.text,
          postedAt: new Date(t.created_at)
        })))
      }
    } catch (error) {
      console.error(`خطأ في جلب تويتر:`, error.message)
    }
  }

  return allTweets
}
// سيتم بناء هذا الـ scraper في الأسبوع الثاني
