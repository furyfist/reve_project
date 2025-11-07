const triggerNotification = (message) => {
  console.log('--- NOTIFICATION TRIGGERED ---');
  console.log(message);
  console.log('------------------------------');
};

module.exports = {
  triggerNotification,
};