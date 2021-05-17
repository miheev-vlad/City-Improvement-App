const mongoose = require('mongoose')

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  supports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }],
  opinions: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.model('Suggestion', suggestionSchema)