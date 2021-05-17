const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const isAuthorization = require('../middleware/isAuthorization');

router.put('/updatepic', isAuthorization, (req,res)=>{
  if (!req.body.pic) {
    return res.status(422).json({ error: 'You need to add an photo' })
  }
  User.findByIdAndUpdate(req.user._id, {
        $set: { photo: req.body.pic }
      }, {
        new:true
      },
      (err,result)=>{
       if(err){
           return res.status(422).json({ error:"Photo can not post"} )
       }
       res.json(result)
  })
})

module.exports = router