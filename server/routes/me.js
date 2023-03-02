const express = require('express')
const auth = require('../middleware/auth')
const { User } = require('../models/user')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  const userId = req.user._id

  const user = await User.findOne({ _id: userId }).select('-password -_id')
  res.status(200).send(user)
})

module.exports = router
