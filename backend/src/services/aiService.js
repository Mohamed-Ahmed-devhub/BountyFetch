// ===================================================
// aiService.js — خدمة الذكاء الاصطناعي (Backend)
// يتواصل مع Claude API لتوليد البروبوزال والشات بوت
// المسار: backend/src/services/aiService.js
// ===================================================

const Anthropic = require('@anthropic-ai/sdk')

// إنشاء عميل Claude API — المفتاح من .env
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ═══════════════════════════════════════════════
// 1. توليد البروبوزال الاحترافي
// ═══════════════════════════════════════════════

/**
 * يولّد نص بروبوزال احترافي بناءً على بيانات المهمة والمستخدم
 * @param {Object} task     - بيانات المهمة من قاعدة البيانات
 * @param {Object} user     - بيانات المستخدم (الاسم + المهارات)
 * @param {string} language - 'ar' أو 'en'
 * @returns {string}        - نص البروبوزال الجاهز
 */
async function generateProposalText(task, user, language = 'ar') {
  const isArabic = language === 'ar'

  // بناء السياق المشترك
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
  `.trim()

  const systemPrompt = isArabic
    ? `أنت كاتب عروض عمل فريلانس محترف ومتخصص. مهمتك كتابة عروض عمل مقنعة واحترافية تزيد من فرص قبول العميل.

قواعد العرض الجيد:
- يبدأ بجملة تجذب الانتباه فوراً وتُظهر أنك فهمت المشكلة
- يُثبت الخبرة بأمثلة أو مهارات محددة
- يقدم خطة واضحة وموجزة للتنفيذ
- يُنهي بدعوة واضحة للتواصل
- بين 120-180 كلمة (مختصر ومؤثر)
- لا يبدأ بـ "مرحباً" أو "أهلاً" المملة — ابدأ بالقيمة مباشرة`

    : `You are a professional freelance proposal writer specializing in tech and web development projects. Your job is to write compelling, concise proposals that maximize client acceptance rates.

Rules for a winning proposal:
- Open with a hook that immediately shows you understand the problem
- Prove expertise with specific skills or relevant examples
- Present a clear, brief execution plan
- End with a clear call-to-action
- Between 120-180 words (concise and impactful)
- Don't start with "Hi" or "Hello" — lead with value`

  const userPrompt = isArabic
    ? `اكتب عرض عمل احترافياً باللغة العربية للمهمة التالية:

${taskContext}

${userContext}

المطلوب: عرض مباشر، مقنع، ومخصص لهذه المهمة تحديداً. لا تكتب عنواناً أو تسمياً — فقط نص العرض الجاهز للإرسال.`

    : `Write a professional English proposal for this task:

${taskContext}

${userContext}

Required: A direct, compelling, task-specific proposal. No heading or labels — just the ready-to-send proposal text.`

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 500,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  })

  return response.content[0].text.trim()
}

// ═══════════════════════════════════════════════
// 2. شات بوت Code Shield
// ═══════════════════════════════════════════════

/**
 * يعالج رسالة المستخدم في شات بوت Code Shield
 * @param {string} message  - رسالة المستخدم الجديدة
 * @param {Array}  history  - تاريخ المحادثة السابقة
 * @returns {string}        - رد الذكاء الاصطناعي
 */
async function chatWithShield(message, history = []) {
  // تحويل تاريخ المحادثة لتنسيق Anthropic
  const formattedHistory = history
    .filter(m => m.role && m.content)
    .slice(-10) // آخر 10 رسائل فقط — توفيراً للـ tokens
    .map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content),
    }))

  // إضافة الرسالة الجديدة
  formattedHistory.push({ role: 'user', content: message })

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: `أنت "Code Shield" — مساعد برمجي متخصص مدمج في منصة BountyFetch.

هويتك وأسلوبك:
- أنت زميل مطور خبير، وليس روبوتاً رسمياً
- تتحدث بلغة المستخدم مباشرةً (عربي إذا كتب عربي، إنجليزي إذا كتب إنجليزي)
- مباشر وعملي — لا تتفلسف وتذهب للحل فوراً

تخصصاتك الأساسية:
1. **Debugging HTML/CSS/JavaScript** — تحديد الأخطاء وإصلاحها
2. **Responsive Design** — إصلاح مشاكل الموبايل والشاشات المختلفة
3. **CSS Flexbox & Grid** — حل مشاكل التوزيع والمحاذاة
4. **JavaScript Bugs** — تتبع الأخطاء المنطقية والتقنية
5. **Code Quality** — تحسين الكود قبل التسليم للعميل

عند استلام كود:
- اقرأه أولاً وحدد المشكلة
- اشرح السبب في جملة أو اثنتين
- قدم الكود المصلح مع تعليقات توضيحية
- أضف نصيحة بونص إذا رأيت تحسيناً ممكناً

مهم: أنت جزء من BountyFetch — المنصة التي تساعد المطورين المبتدئين على الفوز بمهام الفريلانس.`,
    messages: formattedHistory,
  })

  return response.content[0].text.trim()
}

// ═══════════════════════════════════════════════
// 3. فلترة المنشورات بالذكاء الاصطناعي
// ═══════════════════════════════════════════════

/**
 * يحدد هل المنشور طلب عمل حقيقي أم لا
 * @param {string} text - نص المنشور
 * @returns {boolean}
 */
async function isTaskPost(text) {
  // فلترة سريعة بالكلمات المفتاحية أولاً (مجانية — بدون API)
  const keywords = [
    'مطلوب', 'محتاج', 'أبحث عن', 'hire', 'looking for', 'need a developer',
    'need help', 'budget', 'freelancer', 'فريلانس', 'مشروع', 'project',
    'fix', 'تصحيح', 'html', 'css', 'javascript', 'wordpress', 'react',
    'website', 'موقع', 'تصميم', 'design', 'responsive', 'landing page',
  ]
  const lower = text.toLowerCase()
  const hasKeyword = keywords.some(k => lower.includes(k.toLowerCase()))

  if (!hasKeyword) return false // رفض سريع بدون API

  // تأكيد بالذكاء الاصطناعي
  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages:   [{
        role: 'user',
        content: `هل هذا النص يحتوي على طلب عمل برمجي أو تصميم ويب؟
أجب بـ "yes" أو "no" فقط.

النص: "${text.slice(0, 400)}"`,
      }],
    })

    return response.content[0].text.toLowerCase().trim().startsWith('yes')
  } catch {
    // عند فشل API نعتمد على الفلترة السريعة
    return hasKeyword
  }
}

/**
 * يستخرج بيانات منظمة من نص المنشور
 * @param {string} text   - نص المنشور
 * @param {string} source - مصدر المنشور
 * @returns {Object}      - { title, skills, budget }
 */
async function extractTaskData(text, source) {
  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages:   [{
        role: 'user',
        content: `استخرج من النص التالي المعلومات بتنسيق JSON فقط (بدون markdown أو نص إضافي):
{
  "title": "عنوان قصير ووصفي للمهمة (بحد أقصى 80 حرف)",
  "skills": ["مهارة1", "مهارة2"],
  "budget": "الميزانية المذكورة أو null إذا لم تُذكر"
}

قائمة المهارات المتاحة للاستخراج:
HTML, CSS, JavaScript, TypeScript, React, Vue, Next.js, Node.js, PHP, Python, WordPress, Shopify, MySQL, MongoDB, Figma, Bootstrap, Tailwind CSS, Responsive Design, Laravel

النص:
"${text.slice(0, 600)}"`,
      }],
    })

    const raw = response.content[0].text.trim()
    // تنظيف الـ JSON من أي markdown محتمل
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    // بيانات افتراضية عند فشل الاستخراج
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
