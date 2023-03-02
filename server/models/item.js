const Joi = require('joi')
const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: { type: Array, required: true },
  owner: { type: String },
  date: { type: String },
  collectionName: { type: String, required: true },
  collectionId: { type: String, required: true },
  customFields: { type: Array },
  likes: { type: Array },
  comments: [
    {
      owner: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
})

const Item = mongoose.model('items', itemSchema)

const tagsSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
})

const Tags = mongoose.model('tags', tagsSchema)

const commentsSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  owner: { type: String, required: true },
  itemId: { type: String, required: true },
})

const Comments = mongoose.model('comments', commentsSchema)

const validateNewTag = (tag) => {
  const schema = Joi.object({
    tag: Joi.string().min(1).required(),
  })
  return schema.validate(tag)
}

const validateNewItem = (item) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    tags: Joi.array().required().min(1),
    collectionName: Joi.string().min(1).required(),
    customFields: Joi.required(),
  })

  return schema.validate(item)
}

const validateComment = (comment) => {
  const schema = Joi.object({
    comment: Joi.string().min(1).max(100).required(),
    _id: Joi.string().required(),
  })

  return schema.validate(comment)
}

exports.Item = Item
exports.Tags = Tags
exports.Comments = Comments
exports.validateNewTag = validateNewTag
exports.validateNewItem = validateNewItem
exports.validateComment = validateComment
