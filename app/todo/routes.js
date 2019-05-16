const express = require('express');
const router = express.Router();
const todo = require('./model');
const user = require('../user/model');
const { verifyJWT } = require('../utils');

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

const addCollaborator = async (req, res) => {
	const id = req.params.id;
	const token = req.headers['x-access-token'];
	let decodedRes = await verifyJWT(token);
	if (decodedRes.error) {
		res.json(decodedRes);
	} else {
		let foundCollaborator = await user.find({
			email: req.body.collaboratorEmail
		});
		if (foundCollaborator.length <= 0) {
			res.json({ error: true, reason: 'No user found with with given email!' });
		} else if (
			req.body.permissionLevel === null ||
			req.body.permissionLevel === undefined
		) {
			res.json({ error: true, reason: 'No permission level provided!' });
		} else {
			let userData = await user.findById(decodedRes.id);
			if (userData.email === foundCollaborator[0].email) {
				res.json({
					error: true,
					reason: 'cannot add yourself as a collaborator!'
				});
			} else {
				let foundTodo = await todo.findById(id);
				foundTodo.collaborators.forEach(collaborator => {
					if (collaborator.email === req.body.collaboratorEmail) {
						res.json({
							error: true,
							reason: `${req.body.collaboratorEmail} is already a collaborator!`
						});
					}
				});
				foundTodo.collaborators.push({
					email: req.body.collaboratorEmail,
					permissionLevel: req.body.permissionLevel
				});
				foundTodo.save();
				foundCollaborator[0].permissionedTodos.push({
					_id: foundTodo._id,
					todo: foundTodo.content,
					permissionLevel: req.body.permissionLevel
				});
				foundCollaborator[0].save();
				res.json(foundTodo);
			}
		}
	}
};

router.post('/new', createTodo);
router.delete('/:id', deleteTodo);
router.put('/:id', editTodo);
router.post('/:id/collaborator/add', addCollaborator);
module.exports = router;
