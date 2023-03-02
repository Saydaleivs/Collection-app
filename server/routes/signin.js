const express = require('express')
const router = express.Router()
const { validateSignedInUser, User } = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const { error } = validateSignedInUser(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  const { username, password } = req.query

  const user = await User.findOne({ username })
  if (!user) return res.status(400).send('Wrong username or password')

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword)
    return res.status(400).send('Wrong username or password')

  if (!user.isActive) return res.status(403).send('You are blocked')

  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
  res.status(200).send({ token, userId: user._id })
})

module.exports = router
