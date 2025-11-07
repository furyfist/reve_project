const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events.controller');

router.post('/events', eventController.createEvent);

module.exports = router;