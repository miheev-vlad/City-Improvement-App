const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo:{
    type:String,
    default:"https://124ural.ru/wp-content/uploads/2017/04/no-avatar.png"
  },
})

mongoose.model('User', userSchema)