const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('-__v')
    .populate('product', 'name')
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `${req.get('host')}/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        order: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product,
        },
        request: {
          type: 'GET',
          url: `${req.get('host')}/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.id)
    .populate('product')
    .then((order) => {
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: `${req.get('host')}/orders`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  const { id } = req.params;
  Order.remove({ _id: id })
    .then((result) => {
      res.status(200).json({});
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
