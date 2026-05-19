// ===================================================
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
  }
}
