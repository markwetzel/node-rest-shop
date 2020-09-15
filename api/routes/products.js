const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../../middleware/check-auth');
const {
  products_get_all,
  products_create_product,
  products_get_product,
  products_update_product,
  products_delete_product,
} = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept a file
    cb(null, true);
  } else {
    // reject a file
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

router.get('/', products_get_all);

router.get('/:id', products_get_product);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  products_create_product
);

router.patch('/:id', checkAuth, products_update_product);

router.delete('/:id', checkAuth, products_delete_product);

module.exports = router;
