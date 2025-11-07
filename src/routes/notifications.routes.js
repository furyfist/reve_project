const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications.controller');

router.post(
  '/notifications/test',
  notificationController.testNotification
);

module.exports = router;