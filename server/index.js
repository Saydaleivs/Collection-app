const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const signupRoute = require('./routes/signup')
const signinRoute = require('./routes/signin')
const meRoute = require('./routes/me')
const usersRoute = require('./routes/users')
const itemRoute = require('./routes/item')
const collectionRoute = require('./routes/collection')
const searchRoute = require('./routes/search')

app.use(express.json({ limit: '100mb' }))
app.use(cors())

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB...')
  })

app.use('/api/signup', signupRoute)
app.use('/api/signin', signinRoute)
app.use('/api/me', meRoute)
app.use('/api/users', usersRoute)
app.use('/api/item', itemRoute)
app.use('/api/collection', collectionRoute)
app.use('/api/search', searchRoute)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
