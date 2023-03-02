const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Collection, validateNewCollection } = require('../models/collection')
const { User } = require('../models/user')
const { Item } = require('../models/item')
const { default: mongoose } = require('mongoose')

router.post('/', auth, async (req, res) => {
  const { error } = validateNewCollection(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { name, description, image, topic, customFields } = req.body

  const collection = await Collection.findOne({ name })
  if (collection)
    return res.status(400).send('Collection with this name already exists')

  const author = await User.findOne({ _id: req.user._id })
  try {
    const collection = new Collection({
      name,
      description,
      image,
      topic,
      customFields,
      owner: author._id,
    })
    await collection.save()

    res.status(201).send('Collection created successfully')
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/biggest', async (req, res) => {
  const collection = await Collection.find().sort('items.length').limit(2)
  res.send(collection)
})

router.post('/edit', auth, async (req, res) => {
  const { _id, name } = req.body
  const isAvailableCollection = await Collection.findOne({
    _id: { $ne: _id },
    name,
  })
  const manager = await User.findOne({ _id: req.user._id })

  if (!isAvailableCollection) {
    const collection = await Collection.findOne({ _id })

    if (collection.owner.equals(manager._id) || manager.isAdmin) {
      await Collection.updateOne({ _id }, req.body)
      await Item.updateMany(
        { collectionId: req.body._id },
        { collectionName: req.body.name }
      )
      res.send('Updated successfully')
    } else {
      res
        .status(401)
        .send('You must be owner or admin to update this collection')
    }
  } else {
    res.status(400).send('Collection with this name is already available')
  }
})

router.get('/delete', auth, async (req, res) => {
  await Collection.deleteMany({ _id: req.query._id })
  await Item.deleteMany({ collectionId: req.query._id })
  res.send('Deleted successfully')
})

router.get('/delete/multiple', auth, async (req, res) => {
  const manager = await User.findOne({ _id: req.user._id })
  if (manager.isAdmin) {
    await Collection.deleteMany({ _id: { $in: req.query._id } })
    await Item.deleteMany({ collectionId: { $in: req.query._id } })
    res.send('Deleted successfully')
  } else {
    res.status(401).send('You must be an administrator to delete')
  }
})

router.get('/', auth, async (req, res) => {
  const collections = await Collection.find()
  res.send(collections)
})

router.get('/forAdmins', auth, async (req, res) => {
  const collections = await Collection.find().select('name owner topic')
  res.send(collections)
})

router.get('/me', auth, async (req, res) => {
  const collections = await Collection.find({ owner: req.user._id })
  collections.length === 0
    ? res.send('You don`t have collections')
    : res.send(collections)
})

router.get('/:id', async (req, res) => {
  const isItObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (isItObjectId) {
    const collection = await Collection.findOne({ _id: req.params.id })
    res.status(200).send(collection)
  } else {
    const collection = await Collection.findOne({ name: req.params.id })
    if (!collection) return res.status(400).send('Collection not found')
    res.status(200).send(collection)
  }
})

router.get('/:id/items', async (req, res) => {
  const isItObjectId = mongoose.Types.ObjectId.isValid(req.params.id)

  const collection = await Collection.findOne({
    [isItObjectId ? '_id' : 'name']: req.params.id,
  })
  if (!collection) return res.status(404).send('Collection not found')

  const items = await Item.find({ collectionName: collection.name }).select(
    'name items'
  )
  res.send(items)
})

module.exports = router
