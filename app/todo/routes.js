const express = require('express');
const router = express.Router();
const model = require('./model');
const getTodos = (req, res) => {
	res.json('hello world');
};

router.get('/', getTodos);

module.exports = router;
