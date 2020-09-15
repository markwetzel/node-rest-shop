const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err && err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).json({ error: err });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((user) => {
          console.log(user);
          return res.status(201).json({
            message: 'User created',
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({ message: 'Email already in use' });
          }
          return res.status(400).json({ message: 'Invalid email' });
        });
    }
  });
});

router.post('/signin', (req, res, next) => {});

router.delete('/:id', (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((result, deletedCount) => {
      if (deletedCount) {
        return res.sendStatus(204);
      } else {
        return res.sendStatus(410);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
