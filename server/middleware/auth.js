const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function auth(req, res, next) {
  const token = req.header('token')
  if (!token) return res.status(401).send('Token is not available')

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  } catch (ex) {
    return res.status(400).send(ex)
  }
}
