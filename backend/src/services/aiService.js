// ===== خدمة الـ AI - ربط Claude API =====
// مسؤولة عن: توليد البروبوزالات + ردود الشات بوت

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// توليد نص البروبوزال المخصص للمهمة
export async function generateProposalText({ task, user, language }) {
  const isArabic = language === 'ar'

  // بناء الـ Prompt بناءً على اللغة المطلوبة
  const prompt = isArabic
    ? `أنت خبير في كتابة عروض العمل الفريلانس. اكتب عرض عمل احترافي باللغة العربية لهذه المهمة:
       عنوان المهمة: ${task.title}
       وصف المهمة: ${task.description}
       اسم المتقدم: ${user.name}
       مهاراته: ${user.skills?.join(', ') || 'HTML, CSS, JavaScript'}
       
       اجعل البروبوزال: قصير (4-6 جمل)، مباشر، يبرز الخبرة المناسبة، وينتهي بدعوة للتواصل.`
    : `You're a freelance proposal writing expert. Write a professional proposal in English for this task:
       Task Title: ${task.title}
       Task Description: ${task.description}
       Applicant Name: ${user.name}
       Skills: ${user.skills?.join(', ') || 'HTML, CSS, JavaScript'}
       
       Make it: concise (4-6 sentences), direct, highlight relevant experience, end with a CTA.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  })

  return message.content[0].text
}

// رد الشات بوت على رسائل المستخدم
export async function getChatReply({ messages, userCode }) {
  // بناء سياق المحادثة لـ Claude
  const systemPrompt = `أنت "درع الكود الذكي" 🛡️، مساعد برمجي متخصص في:
  1. اكتشاف وإصلاح أخطاء JavaScript/HTML/CSS
  2. تحسين تنسيق Responsive Design
  3. شرح الكود بالعربية بطريقة مبسطة
  
  كن دقيقاً، عملياً، وأعطِ الكود المصحح دائماً.
  ${userCode ? `الكود المُرسل للمراجعة:\n\`\`\`\n${userCode}\n\`\`\`` : ''}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.text }))
  })

  return response.content[0].text
}
