// scrapingJob.js — background scraping without Bull/Redis dependency
const { scrapeRSSFeeds }       = require('../services/scrapers/rssFeedScraper')
const { startTelegramScraper } = require('../services/scrapers/telegramScraper')

function initQueues() {
  startTelegramScraper()

  // Run RSS immediately after 3s startup delay, then every 10 minutes
  setTimeout(async () => {
    try { await scrapeRSSFeeds() } catch (e) { console.error('RSS Error:', e.message) }
  }, 3000)

  setInterval(async () => {
    try { await scrapeRSSFeeds() } catch (e) { console.error('RSS Error:', e.message) }
  }, 10 * 60 * 1000)

  console.log('✅ Scraping queue running (setInterval mode)')
}

async function stopQueues() {
  console.log('Queue stopped')
}

module.exports = { initQueues, stopQueues }
