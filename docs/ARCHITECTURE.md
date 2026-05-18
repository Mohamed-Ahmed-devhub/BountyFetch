# 🏗️ معمارية المشروع

## نظرة عامة
تطبيق Full-Stack يعتمد على:
- **Frontend**: React SPA تتواصل مع Backend عبر REST API + Socket.io
- **Backend**: Node.js يدير الـ Scraping + AI + Real-time
- **Database**: PostgreSQL لحفظ المهام والمستخدمين
- **Queue**: Redis + Bull لجدولة مهام الـ Scraping كل 5 دقائق

## تدفق البيانات
```
المصادر (Telegram/Reddit/RSS/Twitter)
         ↓
    Scraper Services (كل 5 دقائق)
         ↓
    AI Filter (Claude API) - هل هي مهمة برمجية؟
         ↓
    PostgreSQL (حفظ المهمة)
         ↓
    Socket.io (إشعار المستخدمين المناسبين)
         ↓
    React Dashboard (عرض المهمة live)
```
