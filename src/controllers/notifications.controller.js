const { triggerNotification } = require('../services/notification.service');

const testNotification = (req, res) => {
  triggerNotification('This is a MANUAL TEST notification.');
  res.status(200).json({ message: 'Test notification triggered.' });
};

module.exports = {
  testNotification,
};