const express = require('express');
const router = express.Router();
const model = require('./model');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createUser = async (req, res) => {
	const email = req.body.email;
	const passwordHash = bcrypt.hashSync(req.body.password, 8);
	try {
		const user = await model.create({ email: email, password: passwordHash });
		if (user) {
			const token = jwt.sign({ id: user._id }, config.jwt.secret);
			res.json({ auth: true, token: token });
		}
	} catch (err) {
		res.json({ error: 'email already exists' });
		throw err;
	}
};

const getUser = async (req, res) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		res.json({ error: 'no token provided' });
	}
	try {
		const decoded = await jwt.verify(token, config.jwt.secret);
		const user = await model.findById(decoded.id);
		res.json(user);
	} catch (err) {
		res.json({ error: 'invalid token' });
	}
};
router.post('/new', createUser);
router.get('/', getUser);

module.exports = router;
