# 📡 توثيق الـ API

## Base URL
`http://localhost:3001/api`

## المصادقة
أرفق الـ Token في كل طلب محمي:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Auth
| Method | Path | الوصف |
|--------|------|-------|
| POST | /auth/register | تسجيل مستخدم جديد |
| POST | /auth/login | تسجيل الدخول |
| GET | /auth/profile | جلب بيانات المستخدم 🔒 |
| PUT | /auth/skills | تحديث المهارات 🔒 |

### Tasks
| Method | Path | الوصف |
|--------|------|-------|
| GET | /tasks | جلب المهام 🔒 |
| GET | /tasks/:id | تفاصيل مهمة 🔒 |
| POST | /tasks/:id/save | حفظ مهمة 🔒 |

### AI
| Method | Path | الوصف |
|--------|------|-------|
| POST | /ai/proposal | توليد بروبوزال 🔒 |
| POST | /ai/chat | الشات بوت 🔒 |

🔒 = يحتاج Token
