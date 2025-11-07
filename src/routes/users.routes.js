const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controller');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema } = require('../validations/user.validation');

// Routes
router.post('/users',
    validate(createUserSchema),
    userController.createUser
);

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

module.exports = router;