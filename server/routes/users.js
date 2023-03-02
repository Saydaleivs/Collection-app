const express = require('express')
const auth = require('../middleware/auth')
const { User } = require('../models/user')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    '-password -name -__v'
  )
  const usersToSend = users.map((user) => {
    user.isAdmin ? (user.isAdmin = 'Admin') : (user.isAdmin = 'User')
    user.isActive ? (user.isActive = 'Active') : (user.isActive = 'Blocked')
    return user
  })

  res.status(200).send(usersToSend)
})

router.post('/manage', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
  if (!user.isAdmin)
    return res.status(401).send('You are not allowed to manage users!')

  const selectedUsers = req.body.selected

  if (req.body.method === 'Delete') {
    await User.deleteMany({ _id: { $in: selectedUsers } })
    res.status(200).send('Deleted successfully')
  } else if (req.body.method === 'Block or Unblock') {
    await User.updateMany({ _id: { $in: selectedUsers } }, [
      {
        $set: { isActive: { $not: ['$isActive'] } },
      },
    ])
    res.status(200).send('Blocked/Unblocked successfully')
  } else if (req.body.method === 'Add to/remove from admin') {
    await User.updateMany({ _id: { $in: selectedUsers } }, [
      {
        $set: { isAdmin: { $not: ['$isAdmin'] } },
      },
    ])
    res.status(200).send('Added to/removed from admin successfully')
  } else {
    res.status(400).send('What to do these user(s) is not showed')
  }
})

module.exports = router
