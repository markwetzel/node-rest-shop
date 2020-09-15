const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../../middleware/check-auth');

router.post('/signup', UsersController.users_signup);

router.post('/login', UsersController.users_login);

router.delete('/:id', checkAuth, UsersController.users_delete);

module.exports = router;
