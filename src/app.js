const express = require('express');
const app = express();

// --- Middlewares ---

app.use(express.json());


// A simple root route for testing
app.get('/', (req, res) => {
  res.send('Reve Backend is running...');
});

module.exports = app;