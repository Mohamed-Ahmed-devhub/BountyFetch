// filterService.js — re-exports from aiService (Gemini) for backward compatibility
// The Anthropic SDK (old branch) has been replaced with Gemini throughout v3.
const { isTaskPost, extractTaskData } = require('./aiService')
module.exports = { isTaskPost, extractTaskData }
