const express = require('express');
const app = express();
const todoRoutes = require('./todo/routes');
app.use(express.json());

// set cors headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/api/todos/', todoRoutes);

module.exports = app;
