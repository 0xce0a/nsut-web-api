const express = require('express');
const router = express.Router();
const model = require('./model');
const jwt = require('jsonwebtoken');
const userModel = require('../user/model');
const config = require('../config');
const getTodos = async (req, res) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		res.json({ error: 'no token provided' });
	}
	try {
		const decoded = await jwt.verify(token, config.jwt.secret);
		const user = await userModel.findById(decoded.id);
		res.json(user);
	} catch (err) {
		res.json({ error: 'invalid token' });
	}
};

const createTodo = async (req, res) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		res.json({ error: 'no token provided' });
	}
	try {
		const decoded = await jwt.verify(token, config.jwt.secret);
		const todoContent = req.body.content;
		try {
			const response = await model.create({ content: todoContent });
			const user = await userModel.findById(decoded.id);
			if (response) {
				user.todos.push(response);
				res.json(response);
			}
		} catch (err) {
			res.json('something went wrong');
		}
	} catch (err) {
		res.json({ error: 'invalid token' });
	}
};

const deleteTodo = async (req, res) => {
	const id = req.params.id;
	const response = await model.findByIdAndDelete(id);
	res.json(response);
};

const editTodo = async (req, res) => {
	const id = req.params.id;
	const newContent = req.body.newContent;
	const response = await model.findByIdAndUpdate(
		id,
		{ new: true },
		{
			$set: { content: newContent }
		}
	);
	res.json(response);
};

router.get('/', getTodos);
router.post('/new', createTodo);
router.delete('/:id', deleteTodo);
router.put('/:id', editTodo);

module.exports = router;
