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

router.post('/new', createUser);

module.exports = router;
