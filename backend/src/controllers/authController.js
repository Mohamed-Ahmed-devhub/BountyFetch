// ===================================================
// authController.js — منطق التسجيل والدخول
// المسار: backend/src/controllers/authController.js
// ===================================================

const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const { prisma } = require('../config/database')

const makeToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// ── تسجيل مستخدم جديد ──
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول' })

    if (await prisma.user.findUnique({ where: { email } }))
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' })

    const hashed = await bcrypt.hash(password, 12)
    const user   = await prisma.user.create({
      data: { name, email, password: hashed, skills: [] },
    })

    const token = makeToken(user.id)
    res.status(201).json({
      user:  { id: user.id, name: user.name, email: user.email, skills: [] },
      token,
    })
  } catch (e) { next(e) }
}

// ── تسجيل الدخول ──
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' })

    const token = makeToken(user.id)
    res.json({
      user:  { id: user.id, name: user.name, email: user.email, skills: user.skills },
      token,
    })
  } catch (e) { next(e) }
}

// ── جلب الملف الشخصي ──
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.userId },
      select: { id: true, name: true, email: true, skills: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' })
    res.json(user)
  } catch (e) { next(e) }
}

// ── تحديث المهارات ──
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body
    if (!Array.isArray(skills))
      return res.status(400).json({ message: 'المهارات يجب أن تكون مصفوفة' })

    await prisma.user.update({
      where: { id: req.userId },
      data:  { skills },
    })
    res.json({ message: 'تم تحديث المهارات بنجاح', skills })
  } catch (e) { next(e) }
}
