// aiService.js — Gemini API integration
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function getModel(modelName = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model: modelName })
}

// 1. Professional proposal generator — returns { ar, en, highlights }
async function generateProposalText(task, user, language = 'ar') {
  const model = getModel()

  const taskContext = `Task: ${task.title}\nDescription: ${task.description || task.title}\nSkills: ${task.skills?.join(', ') || 'unspecified'}\nBudget: ${task.budget || 'open to negotiation'}\nSource: ${task.source}`
  const userContext = `Applicant: ${user.name}\nSkills: ${user.skills?.join(', ') || 'web developer'}\nTitle: ${user.jobTitle || 'Software Developer'}\nExperience: ${user.yearsExperience || 'N/A'} years`

  const prompt = `You are an expert freelance proposal writer with high conversion rates.

Task data:
${taskContext}

Applicant data:
${userContext}

Write a professional, high-impact proposal. Respond ONLY with valid JSON (no markdown, no backticks):
{
  "ar": "Arabic proposal text (120-180 words, direct, starts with a hook showing problem understanding)",
  "en": "English proposal text (120-180 words, direct, starts with a hook showing problem understanding)",
  "highlights": ["differentiator 1", "differentiator 2", "differentiator 3"]
}

Rules:
- Never start with "Hi" or "مرحباً" — start with value directly
- Each highlight ≤ 8 words
- JSON only, nothing else`.trim()

  try {
    const result = await model.generateContent(prompt)
    const raw    = result.response.text().trim()
    const clean  = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(clean)
    if (!parsed.ar || !parsed.en) throw new Error('Missing proposal fields')
    return parsed
  } catch (e) {
    console.error('Gemini generateProposal error:', e.message)
    return {
      ar: `لدي خبرة واسعة في ${task.skills?.slice(0,2).join(' و') || 'هذا المجال'} وأستطيع تنفيذ "${task.title}" بجودة عالية وفي الوقت المحدد.`,
      en: `I have strong experience in ${task.skills?.slice(0,2).join(' & ') || 'this field'} and can deliver "${task.title}" with high quality on schedule.`,
      highlights: ['Fast delivery', 'High quality', 'Ongoing communication'],
    }
  }
}

// 2. Code Shield chatbot
async function chatWithShield(message, history = []) {
  const model = getModel('gemini-1.5-flash')

  const systemContext = `You are "Code Shield" — a specialist programming assistant embedded in BountyFetch.
Your style: experienced developer colleague, not a formal bot. Direct and practical.
Specialties: HTML/CSS/JS debugging, Responsive Design, Flexbox/Grid, JavaScript bugs, code quality.
Respond in the user's language. When given code: read it, identify the problem, explain the cause briefly, provide the fixed code with comments.`

  const chatHistory = history
    .filter(m => m.role && m.content)
    .slice(-10)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: String(m.content) }] }))

  const chat = model.startChat({
    history: [
      { role: 'user',  parts: [{ text: systemContext }] },
      { role: 'model', parts: [{ text: 'Understood. I am Code Shield, ready to help.' }] },
      ...chatHistory,
    ],
    generationConfig: { maxOutputTokens: 1000 },
  })

  const result = await chat.sendMessage(message)
  return result.response.text().trim()
}

// 3. Task post classifier
async function isTaskPost(text) {
  const keywords = [
    'مطلوب', 'محتاج', 'أبحث عن', 'hire', 'looking for', 'need a developer',
    'need help', 'budget', 'freelancer', 'فريلانس', 'مشروع', 'project',
    'fix', 'html', 'css', 'javascript', 'wordpress', 'react', 'website',
    'موقع', 'تصميم', 'design', 'responsive', 'landing page',
  ]
  const lower      = text.toLowerCase()
  const hasKeyword = keywords.some(k => lower.includes(k.toLowerCase()))
  if (!hasKeyword) return false

  try {
    const model  = getModel()
    const result = await model.generateContent(
      `Does this text contain a programming or web design job request? Answer "yes" or "no" only.\n\nText: "${text.slice(0, 400)}"`
    )
    return result.response.text().toLowerCase().trim().startsWith('yes')
  } catch {
    return hasKeyword
  }
}

// 4. Task data extractor
async function extractTaskData(text, source) {
  try {
    const model  = getModel()
    const prompt = `Extract from the following text in JSON only (no markdown):
{
  "title": "short descriptive task title (max 80 chars)",
  "skills": ["skill1", "skill2"],
  "budget": "mentioned budget or null"
}

Available skills: HTML, CSS, JavaScript, TypeScript, React, Vue, Next.js, Node.js, PHP, Python, WordPress, Shopify, MySQL, MongoDB, Figma, Bootstrap, Tailwind CSS, Responsive Design, Laravel

Text: "${text.slice(0, 600)}"`

    const result = await model.generateContent(prompt)
    const raw    = result.response.text().trim()
    const clean  = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { title: text.slice(0, 75).trim() + (text.length > 75 ? '...' : ''), skills: [], budget: null }
  }
}

module.exports = { generateProposalText, chatWithShield, isTaskPost, extractTaskData }
