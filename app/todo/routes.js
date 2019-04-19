const express = require('express');
const router = express.Router();
const model = require('./model');
const getTodos = async (req, res) => {
	const response = await model.find();
	res.json(response);
};

const createTodo = async (req, res) => {
	const todoContent = req.body.content;
	try {
		const response = await model.create({ content: todoContent });
		res.json(response);
	} catch (err) {
		res.json('something went wrong');
	}
};

router.get('/', getTodos);
router.post('/new', createTodo);

module.exports = router;
