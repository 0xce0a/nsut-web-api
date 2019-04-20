const express = require('express');
const router = express.Router();
const todo = require('./model');
const user = require('../user/model');
const { verifyJWT } = require('../utils');
const getTodos = async (req, res) => {
	const token = req.headers['x-access-token'];
	let decodedRes = await verifyJWT(token);
	if (decodedRes.error) {
		res.json(decodedRes);
	} else {
		user
			.findById(decodedRes.id)
			.populate('todos')
			.exec((err, data) => {
				if (err) {
					res.json(err);
				} else {
					res.json(data);
				}
			});
	}
};

const createTodo = async (req, res) => {
	const token = req.headers['x-access-token'];
	let decodedRes = await verifyJWT(token);
	if (decodedRes.error) {
		res.json(decodedRes);
	} else {
		let fetchedUser = await user.findById(decodedRes.id);
		let newTodo = await todo.create({ content: req.body.content });
		fetchedUser.todos.push(newTodo);
		fetchedUser
			.save()
			.then(() => {
				res.json(newTodo);
			})
			.catch(err => {
				res.json(err);
			});
	}
};

const deleteTodo = async (req, res) => {
	const id = req.params.id;
	const token = req.headers['x-access-token'];
	let decodedRes = await verifyJWT(token);
	if (decodedRes.error) {
		res.json(decodedRes);
	} else {
		let userData = await user.findById(decodedRes.id);
		userData.todos = userData.todos.filter(todo => {
			return todo != id;
		});
		await userData.save();
		const response = await todo.findByIdAndDelete(id);
		res.json(response);
	}
};

const editTodo = async (req, res) => {
	const id = req.params.id;
	const token = req.headers['x-access-token'];
	let decodedRes = await verifyJWT(token);
	if (decodedRes.error) {
		res.json(decodedRes);
	} else {
		const newContent = req.body.newContent;
		const response = await todo.findByIdAndUpdate(
			id,
			{
				$set: {
					content: newContent
				}
			},
			{ new: true }
		);
		res.json(response);
	}
};

router.get('/', getTodos);
router.post('/new', createTodo);
router.delete('/:id', deleteTodo);
router.put('/:id', editTodo);

module.exports = router;
