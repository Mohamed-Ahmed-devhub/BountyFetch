// twitterScraper.js — Twitter/X API v2 (requires TWITTER_BEARER_TOKEN)
const https = require('https')

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url)
    https.get({ ...opts, headers }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
      })
    }).on('error', reject).setTimeout(8000, function() { this.destroy(new Error('timeout')) })
  })
}

const SEARCH_QUERIES = [
  'need web developer -is:retweet',
  'مطلوب مطور موقع -is:retweet',
]

async function scrapeTwitter() {
  if (!process.env.TWITTER_BEARER_TOKEN) return []
  const allTweets = []
  for (const query of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({ query, max_results: '10', 'tweet.fields': 'created_at' })
      const data   = await httpsGet(
        `https://api.twitter.com/2/tweets/search/recent?${params}`,
        { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
      )
      if (data.data) {
        allTweets.push(...data.data.map(t => ({
          source: 'twitter', rawText: t.text, postedAt: new Date(t.created_at),
        })))
      }
    } catch (error) {
      console.error('Twitter scraper error:', error.message)
    }
  }
  return allTweets
}
module.exports = { scrapeTwitter }
