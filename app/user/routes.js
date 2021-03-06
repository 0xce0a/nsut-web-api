const express = require('express');
const router = express.Router();
const user = require('./model');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyJWT } = require('../utils');
const createUser = async (req, res) => {
	const email = req.body.email;
	const passwordHash = bcrypt.hashSync(req.body.password, 8);
	try {
		const newUser = await user.create({ email: email, password: passwordHash });
		if (newUser) {
			const token = jwt.sign({ id: newUser._id }, config.jwt.secret);
			res.json({ auth: true, token: token });
		}
	} catch (err) {
		res.json({ error: true, reason: 'email already exists' });
		throw err;
	}
};

const getUser = async (req, res) => {
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
const login = async (req, res) => {
	const email = req.body.email;
	const foundUser = await user.find({ email: email }).select('+password');
	if (foundUser.length <= 0) {
		res.json({ error: true, reason: 'invalid username or password' });
	} else if (foundUser.length > 0) {
		const match = await bcrypt.compare(
			req.body.password,
			foundUser[0].password
		);
		if (match) {
			const token = jwt.sign({ id: foundUser[0]._id }, config.jwt.secret);
			res.json({ auth: true, token: token });
		} else {
			res.json({ error: true, reason: 'invalid username or password' });
		}
	}
};
router.post('/new', createUser);
router.get('/', getUser);
router.post('/login', login);

module.exports = router;
