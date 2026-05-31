# BountyFetch v3 — مشروع صياد 🎯

منصة ذكاء اصطناعي لرصد مهام الفريلانس من Telegram وReddit، مع شات في الوقت الفعلي، مولّد بروبوزال بالذكاء الاصطناعي، ونظام ملفات شخصية احترافي.

---

## 🚀 متطلبات التشغيل

| الأداة | الإصدار |
|--------|---------|
| Node.js | ≥ 18 |
| Redis | ≥ 7 |
| PostgreSQL (Supabase) | ✅ |

---

## ⚙️ إعداد Backend

```bash
cd backend
npm install
cp .env.example .env   # أضف المفاتيح الحقيقية
npm run db:gen          # توليد Prisma Client
npm run db:push         # رفع الـ Schema لـ Supabase
npm run dev             # تشغيل السيرفر
```

### المتغيرات المطلوبة في `.env`:
```
DATABASE_URL       → من Supabase > Settings > Database
SUPABASE_URL       → من Supabase > Settings > API
SUPABASE_SERVICE_ROLE_KEY → من Supabase > Settings > API
GEMINI_API_KEY     → من https://aistudio.google.com/app/apikey
REDIS_URL          → redis://localhost:6379 (أو Upstash URL)
TELEGRAM_BOT_TOKEN → اختياري للتنبيهات
TELEGRAM_ADMIN_CHAT_ID → اختياري
```

---

## 🎨 إعداد Frontend

```bash
cd frontend
npm install
npm run dev
```

### متغيرات `.env` للـ Frontend:
```
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## 🏗️ ما تم تحديثه (الـ 7 Pillars)

| # | الـ Pillar | التغييرات |
|---|-----------|-----------|
| 1 | WebSockets & Chat | Socket.io + Redis Adapter + حفظ الرسائل في ChatMessage |
| 2 | Live Counters | `io.engine.clientsCount` + `/api/tasks/stats` + عرض ديناميكي |
| 3 | AI Proposal | تحويل كامل لـ Gemini API + JSON output `{ar, en, highlights}` |
| 4 | Source URL | `task.url` مربوط بـ `<a target="_blank">` في TaskCard + Dashboard |
| 5 | Support Tickets | POST `/api/support` + Prisma `tickets` table + Telegram alert |
| 6 | Profile System | Avatar عبر Backend API + حقول: jobTitle, linkedin, github, yearsExperience |
| 7 | Performance | `@index` في schema + Redis caching + `useMemo`/`useCallback` |

---

## 📁 هيكل المشروع

```
bountyfetch_v3/
├── backend/
│   ├── src/
│   │   ├── app.js                    ← نقطة الدخول
│   │   ├── config/
│   │   │   ├── database.js           ← Prisma
│   │   │   ├── redis.js              ← ioredis + helpers
│   │   │   └── socket.js             ← Socket.io + Redis Adapter
│   │   ├── controllers/
│   │   │   ├── aiController.js       ← Gemini proposal + chat
│   │   │   ├── authController.js     ← profile + avatar upload
│   │   │   ├── supportController.js  ← tickets + Telegram
│   │   │   └── taskController.js     ← tasks + stats + cache
│   │   ├── models/schema.prisma      ← @index محسّن + نماذج جديدة
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js         ← سجل رسائل الغرف
│   │   │   ├── supportRoutes.js
│   │   │   └── taskRoutes.js
│   │   └── services/aiService.js     ← Gemini integration
│   └── package.json                  ← dependencies محدّثة
└── frontend/
    └── src/
        ├── hooks/useSocket.js         ← Socket.io hook محسّن
        ├── pages/
        │   ├── Dashboard.jsx          ← live stats + source URL
        │   ├── DevHub.jsx             ← Socket.io chat + live counter
        │   ├── LandingPage.jsx        ← dynamic stats
        │   ├── ProfileSetup.jsx       ← حقول احترافية + avatar
        │   ├── Support.jsx            ← submit ticket → backend
        │   └── TaskDetail.jsx         ← Gemini JSON proposal
        └── components/radar/TaskCard.jsx ← source URL button
```

---

## 🗄️ جداول Supabase Storage المطلوبة

أنشئ هذه الـ Buckets في Supabase Storage:
- `avatars` — Public — لصور الملفات الشخصية
- `chat-files` — Public — لمرفقات الشات
- `support-files` — Public — للقطات شاشة تذاكر الدعم
