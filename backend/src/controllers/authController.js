// ===================================================
<<<<<<< HEAD
// authController.js — Pillar 6: Profile + Avatar Upload via Backend
// المسار: backend/src/controllers/authController.js
// ===================================================

const { createClient }  = require('@supabase/supabase-js')
const { prisma }        = require('../config/database')
const { cacheDel }      = require('../config/redis')
const multer            = require('multer')
const path              = require('path')

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Multer — memory storage (نرفع الـ buffer مباشرةً لـ Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext     = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  },
})

exports.uploadMiddleware = upload.single('avatar')

// POST /api/auth/supabase-sync
exports.supabaseSync = async (req, res, next) => {
  try {
    const { access_token } = req.body
    if (!access_token) return res.status(400).json({ message: 'Token required' })

    const { data: { user: sbUser }, error } = await supabaseAdmin.auth.getUser(access_token)
    if (error || !sbUser) return res.status(401).json({ message: 'Invalid token' })

    const name   = sbUser.user_metadata?.full_name
               || sbUser.user_metadata?.name
               || sbUser.email?.split('@')[0]
               || 'User'
    const email  = sbUser.email
    const avatar = sbUser.user_metadata?.avatar_url || null

    const user = await prisma.user.upsert({
      where:  { id: sbUser.id },
      update: { name, avatar, email },
      create: { id: sbUser.id, name, email, avatar, skills: [], password: '' },
    })

    res.json({
      user: {
        id: user.id, name: user.name, email: user.email,
        avatar: user.avatar, skills: user.skills,
        bio: user.bio, jobTitle: user.jobTitle,
        linkedinUrl: user.linkedinUrl, githubUrl: user.githubUrl,
        yearsExperience: user.yearsExperience,
      },
    })
  } catch (e) { next(e) }
}

// GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.userId },
      select: {
        id: true, name: true, email: true, avatar: true,
        skills: true, bio: true, jobTitle: true,
        linkedinUrl: true, githubUrl: true, yearsExperience: true,
        createdAt: true,
      },
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (e) { next(e) }
}

// PUT /api/auth/profile — Pillar 6: حفظ كل بيانات الملف الشخصي
exports.updateProfile = async (req, res, next) => {
  try {
    const { skills, bio, jobTitle, linkedinUrl, githubUrl, yearsExperience } = req.body

    const data = {}
    if (Array.isArray(skills))          data.skills          = skills
    if (bio          !== undefined)     data.bio             = bio
    if (jobTitle     !== undefined)     data.jobTitle        = jobTitle
    if (linkedinUrl  !== undefined)     data.linkedinUrl     = linkedinUrl
    if (githubUrl    !== undefined)     data.githubUrl       = githubUrl
    if (yearsExperience !== undefined)  data.yearsExperience = Number(yearsExperience) || null

    const user = await prisma.user.update({
      where:  { id: req.userId },
      data,
      select: {
        id: true, name: true, email: true, avatar: true,
        skills: true, bio: true, jobTitle: true,
        linkedinUrl: true, githubUrl: true, yearsExperience: true,
      },
    })

    res.json({ message: 'تم حفظ الملف الشخصي', user })
  } catch (e) { next(e) }
}

// PUT /api/auth/skills (legacy compat)
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body
    if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' })
    await prisma.user.update({ where: { id: req.userId }, data: { skills } })
    res.json({ message: 'Skills updated', skills })
  } catch (e) { next(e) }
}

// POST /api/auth/avatar — Pillar 6: رفع Avatar عبر Backend
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'لم يتم إرفاق صورة' })

    const ext      = path.extname(req.file.originalname).toLowerCase() || '.jpg'
    const filePath = `avatars/${req.userId}${ext}`

    // رفع مباشر لـ Supabase Storage باستخدام Service Role Key
    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert:      true,
      })

    if (uploadError) throw uploadError

    // الحصول على الـ public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // حفظ الـ URL في قاعدة البيانات
    await prisma.user.update({
      where: { id: req.userId },
      data:  { avatar: publicUrl },
    })

    // إبطال cache إن وجد
    await cacheDel(`user:${req.userId}`)

    res.json({ message: 'تم رفع الصورة بنجاح', avatarUrl: publicUrl })
  } catch (e) {
    console.error('❌ Avatar upload error:', e.message)
    next(e)
=======
// authController.js - منطق التسجيل والدخول
// ===================================================
const bcrypt       = require('bcryptjs')
const jwt          = require('jsonwebtoken')
const { prisma }   = require('../config/database')

// دالة توليد الـ JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// تسجيل مستخدم جديد
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // التحقق أن الإيميل غير موجود مسبقاً
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' })

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12)

    // إنشاء المستخدم في قاعدة البيانات
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, skills: [] },
    })

    const token = generateToken(user.id)
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (error) {
    next(error)
  }
}

// تسجيل الدخول
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'بيانات غير صحيحة' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'بيانات غير صحيحة' })

    const token = generateToken(user.id)
    res.json({ user: { id: user.id, name: user.name, email: user.email, skills: user.skills }, token })
  } catch (error) {
    next(error)
  }
}

// جلب الملف الشخصي
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, skills: true, createdAt: true },
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

// تحديث المهارات
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body
    await prisma.user.update({ where: { id: req.userId }, data: { skills } })
    res.json({ message: 'تم تحديث المهارات بنجاح', skills })
  } catch (error) {
    next(error)
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
  }
}
