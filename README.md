# ◈ BountyFetch

> **الرادار الذكي الأسرع لاقتناص وتصفية الفرص البرمجية والمشاريع الحرة في الوقت الفعلي**

---

## 🎯 ما هو BountyFetch؟

BountyFetch منصة ذكاء اصطناعي تُراقب عشرات المجتمعات التقنية ومنصات الفريلانس في آنٍ واحد، تُصفّي الفرص البرمجية بدقة تتجاوز 97%، وتُوصلها إليك مع عرض عمل احترافي جاهز للإرسال — قبل أن يفعل منافسوك.

---

## ✨ المميزات الأساسية

| الميزة | الوصف |
|--------|-------|
| 📡 **Bounty Radar** | مراقبة حية لـ Telegram · Reddit · RSS في الوقت الفعلي |
| 🤖 **AI Proposal Engine** | يُولّد عرض عمل احترافي بالعربية أو الإنجليزية في ثوانٍ |
| 🛡️ **Code Shield** | مساعد داخلي لتصحيح الكود قبل التسليم للعميل |
| 🔁 **RTL/LTR** | تبديل فوري بين العربية والإنجليزية بلمسة واحدة |
| 📱 **Responsive** | متوافق تماماً مع الموبايل والتابلت والشاشات الكبيرة |

---

## 🛠 التقنيات المستخدمة

### Frontend
```
React 18 + Vite       — أسرع أداء للتطوير والإنتاج
Tailwind CSS          — تصميم متجاوب مع دعم RTL
i18next               — نظام ترجمة عربي/إنجليزي
Framer Motion         — أنيميشن سلس واحترافي
React Query           — إدارة الـ API والـ caching
Socket.io Client      — استقبال المهام في الوقت الفعلي
```

### Backend
```
Node.js + Express     — سيرفر سريع وموثوق
Socket.io             — WebSocket للاتصال الحي
PostgreSQL + Prisma   — قاعدة بيانات قوية مع ORM نظيف
Redis + Bull          — Queue لمهام الخلفية الدورية
JWT + bcrypt          — مصادقة آمنة ومشفرة
```

### AI & Data Sources
```
Anthropic Claude API  — فلترة المهام + توليد البروبوزال + Code Shield
Telegram Bot API      — قنوات الفريلانس التقنية (قانوني 100%)
Reddit RSS Feeds      — r/forhire, r/webdev, r/learnprogramming
RSS Feeds             — مواقع العمل الحر الكبرى
```

---

## 🚀 تشغيل المشروع

### المتطلبات الأساسية
```bash
Node.js >= 18.0
PostgreSQL >= 14
Redis >= 6.0
```

### 1. استنساخ المشروع
```bash
git clone https://github.com/your-username/bountyfetch.git
cd bountyfetch
```

### 2. تثبيت الـ Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. إعداد متغيرات البيئة

```bash
# في مجلد backend/
cp .env.example .env
# ثم عدّل .env بمفاتيحك
```

المتغيرات المطلوبة في `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bountyfetch
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=...  (اختياري)
```

### 4. إعداد قاعدة البيانات
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. تشغيل التطبيق

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

افتح المتصفح على: **http://localhost:5173**

---

## 📁 هيكل المجلدات

```
bountyfetch/
├── frontend/                    # واجهة React
│   └── src/
│       ├── components/          # مكونات قابلة لإعادة الاستخدام
│       │   ├── ui/              # Button, Card, Badge
│       │   ├── layout/          # Navbar, Footer, Sidebar
│       │   ├── radar/           # TaskCard, LiveFeed, FilterPanel
│       │   ├── proposal/        # ProposalGenerator
│       │   └── chatbot/         # ChatWindow, MessageBubble
│       ├── pages/               # صفحات التطبيق
│       │   ├── LandingPage.jsx  # الصفحة الرئيسية
│       │   ├── Dashboard.jsx    # الرادار
│       │   ├── TaskDetail.jsx   # تفاصيل المهمة + البروبوزال
│       │   ├── CodeShield.jsx   # الشات بوت
│       │   ├── ProfileSetup.jsx # اختيار المهارات
│       │   └── Auth/            # Login, Register
│       ├── context/             # AuthContext, LanguageContext
│       ├── hooks/               # useSocket, useNotifications
│       ├── services/            # api.js, taskService, aiService
│       └── locales/             # ar.json, en.json
│
└── backend/                     # سيرفر Node.js
    └── src/
        ├── config/              # database, socket, redis
        ├── controllers/         # auth, task, ai
        ├── routes/              # authRoutes, taskRoutes, aiRoutes
        ├── middleware/          # authMiddleware, errorHandler
        ├── services/
        │   ├── aiService.js     # Claude API integration
        │   └── scrapers/        # telegram, rss scrapers
        ├── jobs/                # scrapingJob (Bull Queue)
        └── models/              # schema.prisma
```

---

## 📊 معمارية النظام

```
┌─────────────────┐     WebSocket      ┌──────────────────┐
│   React Client  │◄──────────────────►│   Node.js Server │
│   (Vite + RTL)  │     REST API       │  (Express + JWT)  │
└─────────────────┘                    └────────┬─────────┘
                                                │
                    ┌───────────────────────────┤
                    │                           │
              ┌─────▼──────┐           ┌────────▼────────┐
              │ PostgreSQL  │           │  Bull Queue      │
              │ (Prisma)   │           │  (Redis)         │
              └────────────┘           └────────┬────────┘
                                                │
              ┌─────────────────────────────────┤
              │                │                │
        ┌─────▼─────┐   ┌──────▼──────┐  ┌─────▼──────┐
        │  Telegram  │   │  Reddit RSS │  │ Claude API │
        │  Bot API   │   │   Feeds     │  │    (AI)    │
        └───────────┘   └─────────────┘  └────────────┘
```

---

## 🌐 النشر (Deployment)

### Frontend → Vercel
```bash
cd frontend && npm run build
# رفع على Vercel أو Netlify
```

### Backend → Railway / Render
```bash
# إضافة متغيرات البيئة في لوحة تحكم Railway
# ثم توصيل الـ Repository مباشرة
```

---

## 📄 الترخيص

© 2025 BountyFetch. جميع الحقوق محفوظة.

---

<div align="center">
  <strong>صُنع بـ ❤️ وذكاء اصطناعي</strong>
</div>
