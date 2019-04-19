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

const deleteTodo = async (req, res) => {
	const id = req.params.id;
	const response = await model.findByIdAndDelete(id);
	res.json(response);
};

const editTodo = async (req, res) => {
	const id = req.params.id;
	const newContent = req.body.newContent;
	const response = await model.findByIdAndUpdate(id, {
		$set: { content: newContent }
	});
	res.json(response);
};

router.get('/', getTodos);
router.post('/new', createTodo);
router.delete('/:id', deleteTodo);
router.put('/:id', editTodo);

module.exports = router;
