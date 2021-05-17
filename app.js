const express = require('express')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')

const app = express()
const PORT = process.env.PORT || 5000

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
mongoose.connection.on('connected', () => {
  console.log('Successful connection to the MongoDB');
})
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB: ', err);
})

require('./models/User')
require('./models/Suggestion')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/suggestion'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})