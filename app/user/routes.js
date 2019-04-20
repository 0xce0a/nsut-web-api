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
		res.json({ error: 'email already exists' });
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
router.post('/new', createUser);
router.get('/', getUser);

module.exports = router;
