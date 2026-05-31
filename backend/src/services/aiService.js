// ===================================================
<<<<<<< HEAD
// aiService.js — Pillar 3: Gemini API Enterprise Grade
// المسار: backend/src/services/aiService.js
// ===================================================

const { GoogleGenerativeAI } = require('@google/generative-ai')

// ── إنشاء عميل Gemini — المفتاح من .env فقط ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function getModel(modelName = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model: modelName })
}

// ═══════════════════════════════════════════════════
// 1. توليد البروبوزال الاحترافي — JSON output
// ═══════════════════════════════════════════════════

/**
 * يولّد بروبوزال احترافي بالعربية والإنجليزية
 * @returns {{ ar: string, en: string, highlights: string[] }}
 */
async function generateProposalText(task, user, language = 'ar') {
  const model = getModel()

  const taskContext = `
عنوان المهمة: ${task.title}
وصف المهمة: ${task.description || task.title}
المهارات المطلوبة: ${task.skills?.join(', ') || 'غير محددة'}
الميزانية: ${task.budget || 'مفتوح للتفاوض'}
المصدر: ${task.source}
  `.trim()

  const userContext = `
اسم المتقدم: ${user.name}
مهارات المتقدم: ${user.skills?.join(', ') || 'مطور ويب'}
المسمى الوظيفي: ${user.jobTitle || 'مطور برمجيات'}
سنوات الخبرة: ${user.yearsExperience || 'غير محدد'}
  `.trim()

  const prompt = `
أنت خبير كتابة عروض عمل فريلانس احترافية عالية التحويل.

بيانات المهمة:
${taskContext}

بيانات المتقدم:
${userContext}

المطلوب: اكتب عرض عمل احترافياً عالي التأثير. أجب فقط بـ JSON صالح (بدون markdown أو backticks):
{
  "ar": "نص العرض باللغة العربية (120-180 كلمة، مباشر ومقنع، يبدأ بجملة تُظهر فهم المشكلة)",
  "en": "Proposal text in English (120-180 words, direct and compelling, starts with a hook showing problem understanding)",
  "highlights": ["نقطة تمييز 1", "نقطة تمييز 2", "نقطة تمييز 3"]
}

قواعد صارمة:
- لا تبدأ بـ "مرحباً" أو "Hi" — ابدأ بالقيمة مباشرة
- كل نقطة في highlights لا تتجاوز 8 كلمات
- JSON فقط، لا شيء آخر
  `.trim()

  try {
    const result = await model.generateContent(prompt)
    const raw    = result.response.text().trim()

    // تنظيف من أي markdown محتمل
    const clean = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    const parsed = JSON.parse(clean)

    // التحقق من الحقول المطلوبة
    if (!parsed.ar || !parsed.en) throw new Error('Missing proposal fields')

    return parsed
  } catch (e) {
    console.error('❌ Gemini generateProposal:', e.message)
    // fallback نصي
    return {
      ar: `مرحباً، لدي خبرة واسعة في ${task.skills?.slice(0,2).join(' و') || 'هذا المجال'} وأستطيع تنفيذ مشروعك "${task.title}" بجودة عالية وفي الوقت المحدد. سأبدأ فوراً بعد التواصل.`,
      en: `I have strong experience in ${task.skills?.slice(0,2).join(' & ') || 'this field'} and can deliver "${task.title}" with high quality on schedule. Ready to start immediately.`,
      highlights: ['تسليم سريع', 'جودة عالية', 'تواصل مستمر'],
    }
  }
}

// ═══════════════════════════════════════════════════
// 2. شات بوت Code Shield
// ═══════════════════════════════════════════════════

async function chatWithShield(message, history = []) {
  const model = getModel('gemini-1.5-flash')

  const systemContext = `أنت "Code Shield" — مساعد برمجي متخصص مدمج في منصة BountyFetch.

هويتك وأسلوبك:
- أنت زميل مطور خبير، وليس روبوتاً رسمياً
- تتحدث بلغة المستخدم مباشرةً (عربي إذا كتب عربي، إنجليزي إذا كتب إنجليزي)
- مباشر وعملي — لا تتفلسف، اذهب للحل فوراً

تخصصاتك:
1. Debugging HTML/CSS/JavaScript — تحديد الأخطاء وإصلاحها
2. Responsive Design — إصلاح مشاكل الموبايل
3. CSS Flexbox & Grid — حل مشاكل التوزيع والمحاذاة
4. JavaScript Bugs — تتبع الأخطاء المنطقية والتقنية
5. Code Quality — تحسين الكود قبل التسليم

عند استلام كود: اقرأه، حدد المشكلة، اشرح السبب في جملة، قدم الكود المصلح مع تعليقات.
أنت جزء من BountyFetch — المنصة التي تساعد المطورين على الفوز بمهام الفريلانس.`

  // تحويل تاريخ المحادثة لتنسيق Gemini
  const chatHistory = history
    .filter(m => m.role && m.content)
    .slice(-10)
    .map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content) }],
    }))

  const chat = model.startChat({
    history: [
      { role: 'user',  parts: [{ text: systemContext }] },
      { role: 'model', parts: [{ text: 'مفهوم، أنا Code Shield جاهز للمساعدة!' }] },
      ...chatHistory,
    ],
    generationConfig: { maxOutputTokens: 1000 },
  })

  const result = await chat.sendMessage(message)
  return result.response.text().trim()
}

// ═══════════════════════════════════════════════════
// 3. فلترة + استخراج بيانات المنشورات
// ═══════════════════════════════════════════════════

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
      `هل النص التالي يحتوي على طلب عمل برمجي أو تصميم ويب؟ أجب بـ "yes" أو "no" فقط.\n\nالنص: "${text.slice(0, 400)}"`
    )
    return result.response.text().toLowerCase().trim().startsWith('yes')
  } catch {
    return hasKeyword
  }
}

async function extractTaskData(text, source) {
  try {
    const model  = getModel()
    const prompt = `استخرج من النص التالي المعلومات بتنسيق JSON فقط (بدون markdown):
{
  "title": "عنوان قصير ووصفي للمهمة (بحد أقصى 80 حرف)",
  "skills": ["مهارة1", "مهارة2"],
  "budget": "الميزانية المذكورة أو null إذا لم تُذكر"
}

قائمة المهارات المتاحة: HTML, CSS, JavaScript, TypeScript, React, Vue, Next.js, Node.js, PHP, Python, WordPress, Shopify, MySQL, MongoDB, Figma, Bootstrap, Tailwind CSS, Responsive Design, Laravel

النص: "${text.slice(0, 600)}"`

    const result = await model.generateContent(prompt)
    const raw    = result.response.text().trim()
    const clean  = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      title:  text.slice(0, 75).trim() + (text.length > 75 ? '...' : ''),
      skills: [],
      budget: null,
    }
  }
}

module.exports = {
  generateProposalText,
  chatWithShield,
  isTaskPost,
  extractTaskData,
}
=======
// aiService.js - التواصل مع Claude API
// يولد البروبوزال ويشغل الشات بوت الداخلي
// ===================================================
const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// توليد نص البروبوزال الاحترافي
async function generateProposalText(task, user, language = 'ar') {
  const isArabic = language === 'ar'

  const prompt = isArabic
    ? `أنت خبير في كتابة عروض العمل الفريلانس. 
اكتب عرض عمل احترافي وجذاب باللغة العربية للمهمة التالية:

عنوان المهمة: ${task.title}
تفاصيل المهمة: ${task.description}
المهارات المطلوبة: ${task.skills?.join(', ')}

مهارات المتقدم: ${user.skills?.join(', ')}
اسم المتقدم: ${user.name}

اجعل العرض: مختصراً (150-200 كلمة)، شخصياً، يُظهر الفهم للمهمة، ويُبرز المهارات المناسبة.`
    : `You are an expert freelance proposal writer.
Write a professional and compelling proposal in English for this task:

Task Title: ${task.title}
Task Details: ${task.description}
Required Skills: ${task.skills?.join(', ')}

Applicant Skills: ${user.skills?.join(', ')}
Applicant Name: ${user.name}

Make it: concise (150-200 words), personalized, shows understanding of the task, highlights relevant skills.`

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages:   [{ role: 'user', content: prompt }],
  })

  return response.content[0].text
}

// شات بوت Code Shield
async function chatWithShield(message, history = []) {
  // تحويل تاريخ المحادثة لتنسيق Claude
  const messages = history.map(msg => ({
    role:    msg.role,
    content: msg.content,
  }))

  // إضافة الرسالة الجديدة
  messages.push({ role: 'user', content: message })

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system:     `أنت مساعد برمجي متخصص في مساعدة مطوري الويب المبتدئين.
وظيفتك: مساعدة المستخدم في:
1. تصحيح أخطاء الكود (Debugging)
2. إصلاح مشاكل CSS والـ Responsive Design
3. شرح الكود بطريقة بسيطة
4. تقديم نصائح عملية للمبتدئين

اردّ باللغة التي يكتب بها المستخدم. إذا أرسل كوداً، اشرح المشكلة وقدم الحل مع تعليقات توضيحية.`,
    messages,
  })

  return response.content[0].text
}

module.exports = { generateProposalText, chatWithShield }
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
