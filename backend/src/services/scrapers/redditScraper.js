// redditScraper.js — Reddit JSON API (no key needed, uses built-in https)
const https = require('https')

const SUBREDDITS = ['forhire', 'webdev']

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url)
    https.get({ ...opts, headers: { 'User-Agent': 'BountyFetch/1.0' } }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
      })
    }).on('error', reject).setTimeout(8000, function() { this.destroy(new Error('timeout')) })
  })
}

async function scrapeReddit() {
  const allPosts = []
  for (const subreddit of SUBREDDITS) {
    try {
      const data = await httpsGet(`https://www.reddit.com/r/${subreddit}/new.json?limit=10`)
      const posts = data.data.children.map(p => ({
        source:   'reddit',
        subreddit,
        rawText:  `${p.data.title}\n${p.data.selftext}`,
        url:      `https://reddit.com${p.data.permalink}`,
        postedAt: new Date(p.data.created_utc * 1000),
      }))
      allPosts.push(...posts)
    } catch (error) {
      console.error(`Reddit r/${subreddit} error:`, error.message)
    }
  }
  return allPosts
}
module.exports = { scrapeReddit }
