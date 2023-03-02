const Joi = require('joi')
const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  topics: {
    type: Array,
  },
  image: {
    type: String,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  customFields: {
    type: Array,
  },
  items: [
    {
      itemId: { type: String, required: true },
      owner: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
})

const Collection = mongoose.model('collections', collectionSchema)

const validateNewCollection = (collection) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    description: Joi.string().min(1).max(255).required(),
    topic: Joi.string().required(),
    image: Joi.string(),
    customFields: Joi.array(),
  })

  return schema.validate(collection)
}

exports.Collection = Collection
exports.validateNewCollection = validateNewCollection
