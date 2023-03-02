const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Collection } = require('../models/collection')
const {
  Item,
  Tags,
  Comments,
  validateNewTag,
  validateComment,
  validateNewItem,
} = require('../models/item')
const { User } = require('../models/user')

router.get('/id/:id', async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id })
  if (!item) return res.status(400).send('Item not found')

  const tags = item.tags.map((tag) => {
    return {
      tag,
    }
  })
  const allTags = await Tags.find()
  res.status(200).send({ item: { ...item, tags }, allTags })
})

router.post('/', auth, async (req, res) => {
  const { error } = validateNewItem(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { name, tags, collectionName, customFields } = req.body

  const isAvailableCollection = await Collection.findOne({
    name: collectionName,
  })
  if (!isAvailableCollection)
    return res.status(400).send('This collection is not available')

  const author = await User.findOne({ _id: req.user._id })
  const isAllowedUser =
    author._id !== isAvailableCollection.owner || !owner.isAdmin
  if (!isAllowedUser)
    return res
      .status(401)
      .send('You must be owner of this collection then create item')

  const customFieldArray = []
  Object.keys(customFields).forEach((key) =>
    customFieldArray.push({
      [key]: customFields[key],
    })
  )
  try {
    if (isAllowedUser) {
      const newItem = new Item({
        name,
        tags,
        collectionName,
        collectionId: isAvailableCollection._id,
        customFields: customFieldArray,
        owner: isAvailableCollection.owner,
        likes: [],
      })
      await newItem.save()

      const itemId = await Item.findOne({ name })
      await Collection.updateOne(
        { name: collectionName },
        {
          $push: {
            items: { name, itemId: itemId._id, owner: author.username },
          },
        }
      )

      res.status(201).send('Item created successfully')
    }
  } catch (err) {
    res.send('err')
  }
})

router.get('/', async (req, res) => {
  const items = await Item.find()
  res.status(200).send(items)
})

router.get('/like', auth, async (req, res) => {
  const { _id } = req.query
  if (!_id) return res.status(400).send('Error: Invalid id')

  const item = await Item.findOne({ _id })
  const isLiked = item.likes.includes(req.user._id)

  if (!isLiked) {
    await Item.updateOne(
      { _id },
      {
        $push: {
          likes: req.user._id,
        },
      }
    )
    res.status(200).send('liked')
  } else {
    await Item.updateOne(
      { _id },
      {
        $pull: {
          likes: req.user._id,
        },
      }
    )
    res.status(200).send('disliked')
  }
})

router.get('/tag', auth, async (req, res) => {
  const tag = req.query.tag
  const { error } = validateNewTag({ tag })
  if (error) return res.status(400).send(error.details[0].message)

  const isAvailableTag = await Tags.find({ tag })

  if (isAvailableTag.length === 0) {
    const newTag = await Tags({
      tag,
    })
    await newTag.save()
    res.status(200)
  }
})

router.get('/data/:id', auth, async (req, res) => {
  const collection = await Collection.findOne({ name: req.params.id }).select(
    'name customFields'
  )
  if (!collection) return res.status(400).send('Collection not found')

  const tags = await Tags.find().select('tag -_id')

  res.status(200).send({ collection, tags })
})

router.post('/comment', auth, async (req, res) => {
  const { error } = validateComment(req.body.comment)
  if (error) return res.status(400).send('Comment cannot be empty')

  const author = await User.findOne({ _id: req.user._id })
  if (!author) return res.status(401).send('Please sign up or sign in first')

  await Item.updateOne(
    { _id: req.body.comment._id },
    {
      $push: {
        comments: {
          owner: author.username,
          comment: req.body.comment.comment,
        },
      },
    }
  )
  const newComment = new Comments({
    owner: author.username,
    comment: req.body.comment.comment,
    itemId: req.body.comment._id,
  })
  await newComment.save()

  res.status(200).send('Commented successfully')
})

router.get('/comments', async (req, res) => {
  const comments = await Item.findOne({
    _id: req.query.commentId,
  }).select('comments')
  res.status(200).send(comments)
})

router.get('/hello', (req, res) => {
  res.send('Welcome')
})

router.post('/edit', auth, async (req, res) => {
  const manager = await User.findOne({ _id: req.user._id })
  const itemToEdit = await Item.findOne({ _id: req.body._id })
  if (req.user._id === itemToEdit.owner || manager.isAdmin) {
    await Item.updateOne({ _id: req.body._id }, req.body)
    res.send('Item updated successfully')
  } else {
    res.status(401).send('You are not owner of this item')
  }
})

router.get('/delete', auth, async (req, res) => {
  const manager = await User.findOne({ _id: req.user._id })

  const items = await Item.find({ _id: { $in: req.query._id } }).select('owner')
  const isAllSameOwner = items.filter((i) => i.owner !== req.user._id)

  if (isAllSameOwner.length === 0 || manager.isAdmin) {
    await Item.deleteMany({ _id: { $in: req.query._id } })
    await Comments.deleteMany({ itemId: { $in: req.query._id } })
    res.send('items deleted')
  } else {
    res.status(400).send('You must be the owner or admin')
  }
})

module.exports = router
