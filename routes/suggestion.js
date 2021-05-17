const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const isAuthorization = require('../middleware/isAuthorization')
const Suggestion = mongoose.model('Suggestion')

router.post('/create', isAuthorization, (req, res) => {
  const { title, body, picUrl } = req.body
  if (!picUrl) {
    return res.status(422).json({ error: 'You need to add an image' })
  }
  if (!title || !body || !picUrl) {
    return res.status(422).json({ error: 'Plase add all the fields' })
  }
  req.user.password = undefined
  const post = new Suggestion({
    title,
    body,
    photo: picUrl,
    postedBy: req.user
  })
  post.save()
    .then((result) => {
      res.json({ suggestion: result })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get('/getall', isAuthorization, (req, res) => {
  Suggestion.find()
    .populate('postedBy', '_id name email photo')
    .populate('opinions.createdBy', '_id name photo')
    .then((suggestions) => {
      res.json({ suggestions })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/suggestions/:id', isAuthorization, (req, res) => {
  Suggestion.findOne({ _id: req.params.id })
    .populate('postedBy', '_id name email photo')
    .populate('opinions.createdBy', '_id name photo')
    .then((result) => {
      res.json({ suggestion: result })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/mysuggestions', isAuthorization, (req, res) => {
  Suggestion.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .then((suggestions) => {
      res.json({ suggestions })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.put('/support', isAuthorization, (req, res) => {
  Suggestion.findByIdAndUpdate(req.body.suggestionId, {
    $push: { supports: req.user._id }
  }, {
    new: true
  })
  .populate('postedBy', '_id name email photo')
  .populate('opinions.createdBy', '_id name photo')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put('/unsupport', isAuthorization, (req, res) => {
  Suggestion.findByIdAndUpdate(req.body.suggestionId, {
    $pull: { supports: req.user._id }
  }, {
    new: true
  })
  .populate('postedBy', '_id name email photo')
  .populate('opinions.createdBy', '_id name photo')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put('/postopinion', isAuthorization, (req, res) => {
  const opinion = {
    text: req.body.text,
    createdBy: req.user._id
  }
  Suggestion.findByIdAndUpdate(req.body.suggestionId, {
    $push: { opinions: opinion }
  }, {
    new: true
  })
  .populate('postedBy', '_id name email photo')
  .populate('opinions.createdBy', '_id name photo')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.delete('/delete/:id', isAuthorization, (req, res) => {
  Suggestion.findOne({ _id: req.params.id })
    .populate('postedBy', '_id')
    .exec((err, suggestion) => {
      if (err || !suggestion) {
        return res.status(422).json({ error: err })
      }
      if (suggestion.postedBy._id.toString() === req.user._id.toString()) {
        suggestion.remove()
          .then((result) => {
            res.json({
              result,
              message: 'Successfully deleted'
            })
          })
          .catch((err) => {
            console.log(err);
          })
      }
    })
})

router.post('/search-suggestion', (req,res) => {
  if (req.body.query) {
  let suggestPattern = new RegExp((req.body.query), 'i')
  Suggestion.find({ title: { $regex: suggestPattern } })
  .select("_id title")
  .then((suggestion) => {
      res.json({ suggestion })
  }).catch((err) => {
      console.log(err)
  })} else {
    res.json({ suggestion: [] })
  }
})

module.exports = router