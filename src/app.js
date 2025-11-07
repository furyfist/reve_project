const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/users.routes');
const eventRoutes = require('./routes/events.routes');
const notificationRoutes = require('./routes/notifications.routes.js');

// Routes
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Reve Backend is running...');
});

module.exports = app;