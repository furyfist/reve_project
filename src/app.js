const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
const userRoutes = require('./routes/users.routes');

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Reve Backend is running...');
});

module.exports = app;