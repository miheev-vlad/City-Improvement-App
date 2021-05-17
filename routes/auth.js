const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { JWT_SECRET } = require('../config/keys');
const isAuthorization = require('../middleware/isAuthorization');

router.post(
  '/signup',
  [
    check('email', ' incorrect email;').isEmail(),
    check('password', ' minimum password length 5 characters;')
      .isLength({ min: 5 })
  ],
  (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(422).json({ error: 'Please add all the fields.' })
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errStr = 'Incorrect signup data:';
      for (const err of errors['errors']) {
        errStr += err['msg']
      }
      return res.status(400).json({ error: errStr.replace(/.$/, '.') });
    }
    User.findOne({ email })
      .then((savedUser) => {
        if(savedUser) {
          return res.status(422).json({ error: 'The user with this email already exists.' })
        }
        bcrypt.hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              name,
              email,
              password: hashedPassword
            })
            user.save()
              .then((user) => {
                res.json({
                  message: 'Saved successfully. Now SignIn!',
                  email
                })
              })
              .catch((err) => {
                console.log(err);
              })
          })
      })
      .catch((err) => {
        console.log(err);
      })
})

router.post(
  '/signin',
  [
    check('email', 'Incorrect email.').isEmail()
  ],
  (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: 'Please add email or password.' })
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errStr = '';
    for (const err of errors['errors']) {
      errStr += err['msg']
    }
    return res.status(400).json({ error: errStr.replace(/.$/, '.') });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(401).json({ error: 'Incorrect signin data.' })
      }
      bcrypt.compare(password, savedUser.password)
        .then((isMatch) => {
          if (isMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { _id, name, email, photo } = savedUser;
            res.json({
              token,
              user: {
              _id,
              name,
              email,
              photo
              },
              message: 'Successful signin'
            })
          } else {
            return res.status(401).json({ error: 'Incorrect signin data.' })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
})

module.exports = router