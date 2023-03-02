const express = require('express')
const router = express.Router()
const { validateSignedUpUser, User } = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const { error } = validateSignedUpUser(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  const { name, username, email, password } = req.query

  let isUniqueUsername = await User.findOne({ username })
  if (isUniqueUsername)
    return res.status(400).send('This username is already taken !')

  try {
    const user = new User({
      name,
      username,
      email,
      password,
      isAdmin: false,
      isActive: true,
    })
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    res.status(200).send({ token, userId: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
