const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('-__v')
    .then((products) => {
      const response = {
        count: products.length,
        products: products.map((product) => ({
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          _id: product._id,
          request: {
            type: 'GET',
            url: `${req.get('host')}/products/${product._id}`,
          },
        })),
      };
      res.status(200).json(response);
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.products_create_product = (req, res, next) => {
  console.log(req.file);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((product) => {
      console.log(product);
      res.status(201).json({
        createdProduct: {
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          _id: product._id,
          request: {
            type: 'GET',
            url: `${req.get('host')}/products/${product._id}`,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_get_product = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .select('-__v')
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'No valid product for id' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: req.params.id }, { $set: updateOps })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        request: {
          type: 'GET',
          url: `${req.get('host')}/products/${product._id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_delete_product = (req, res, next) => {
  Product.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ error: err }));
};
