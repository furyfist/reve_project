const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controller');

// Routes
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

module.exports = router;