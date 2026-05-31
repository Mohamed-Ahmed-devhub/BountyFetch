// ===================================================
// scrapingJob.js — بدون Redis (setInterval بدلاً من Bull)
// المسار: backend/src/jobs/scrapingJob.js
// ===================================================

const { scrapeRSSFeeds } = require("../services/scrapers/rssFeedScraper");
const {
  startTelegramScraper,
} = require("../services/scrapers/telegramScraper");

function initQueues() {
  // تشغيل Telegram
  startTelegramScraper();

  // تشغيل RSS كل 10 دقائق
  setInterval(
    async () => {
      try {
        await scrapeRSSFeeds();
      } catch (e) {
        console.error("RSS Error:", e.message);
      }
    },
    10 * 60 * 1000,
  );

  // تشغيل فوري بعد 3 ثواني من بدء السيرفر
  setTimeout(async () => {
    try {
      await scrapeRSSFeeds();
    } catch (e) {
      console.error("RSS Error:", e.message);
    }
  }, 3000);

  console.log("✅ Queue يعمل بدون Redis");
}

async function stopQueues() {
  console.log("Queue أوقفت");
}

module.exports = { initQueues, stopQueues };
