const express = require('express')
const { Collection } = require('../models/collection')
const { Item, Comments } = require('../models/item')
const router = express.Router()

router.get('/', async (req, res) => {
  const { q } = req.query

  const collections = await Collection.find({ $text: { $search: q } })
  const items = await Item.find({ $text: { $search: q } })
  const comments = await Comments.find({ $text: { $search: q } })

  if (collections.length === 0 && items.length === 0 && comments.length === 0) {
    res.send('no results found')
  } else {
    res.send({ collections, items, comments })
  }
})

module.exports = router
