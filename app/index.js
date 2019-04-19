const express = require('express');
const app = express();
const todoRoutes = require('./todo/routes');
const userRoutes = require('./user/routes');
app.use(express.json());

// set cors headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/api/todo/', todoRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
