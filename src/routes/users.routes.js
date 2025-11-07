const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

// POST /users
router.post('/users', userController.createUser);

// GET /users
router.get('/users', userController.getAllUsers);

module.exports = router;