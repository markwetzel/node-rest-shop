const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.users_signup = (req, res, next) => {
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
};

exports.users_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      console.log({ user });

      bcrypt.compare(req.body.password, user.password, (err, same) => {
        if (same) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );

          return res.status(200).json({ token });
        } else {
          return res.sendStatus(401);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.users_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((result, deletedCount) => {
      const userDeleted = result.n === 1;
      if (userDeleted) {
        return res.sendStatus(204);
      } else {
        return res.sendStatus(410);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};
