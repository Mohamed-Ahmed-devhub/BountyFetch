// errorHandler.js — centralised error handler
module.exports = function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message)

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'A record with this value already exists.' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found.' })
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large (max 5 MB).' })
  }

  const status  = err.status || err.statusCode || 500
  const message = process.env.NODE_ENV === 'production'
    ? (status < 500 ? err.message : 'Internal server error')
    : err.message

  res.status(status).json({ message })
}
