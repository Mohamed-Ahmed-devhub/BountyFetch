// ===================================================
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
