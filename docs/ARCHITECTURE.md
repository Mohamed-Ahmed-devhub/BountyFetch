# 🏗️ معمارية المشروع

## نظرة عامة
Task-Bounty Agent يعتمد على بنية Client-Server كلاسيكية مع إضافة طبقة Real-time.

## تدفق البيانات
```
[مصادر البيانات]        [Backend]           [Frontend]
Telegram API    →  Scraper → Queue →  Socket.io → Dashboard
Reddit RSS      →  Filter (AI)      →  REST API → Task Detail
Twitter API     →  Database         →  AI API   → Code Shield
```

## التقنيات والأسباب
- **React + Vite**: أسرع تطوير وأداء أفضل من CRA
- **Tailwind**: دعم RTL مدمج وتطوير سريع
- **Socket.io**: Real-time ثنائي الاتجاه
- **Bull + Redis**: Queue موثوقة تعمل حتى لو السيرفر أعيد تشغيله
- **Prisma**: Type-safe ORM يسهل التعامل مع PostgreSQL
