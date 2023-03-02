const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 1,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 1,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  // collections: {
  //   name: {
  //     type: String,
  //     required: true,
  //   },
  //   description: {
  //     type: String,
  //     required: true,
  //   },
  //   topic: {
  //     type: String,
  //     required: true,
  //   },
  //   image: {
  //     type: String,
  //     required: true,
  //   },
  // },
})

const User = mongoose.model('users', userSchema)

const validateSignedUpUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    username: Joi.string().min(1).max(20).trim().required(),
    password: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().required(),
  })

  return schema.validate(user)
}

const validateSignedInUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(1).max(20).required(),
    password: Joi.string().min(1).max(255).required(),
  })

  return schema.validate(user)
}

exports.User = User
exports.validateSignedUpUser = validateSignedUpUser
exports.validateSignedInUser = validateSignedInUser
