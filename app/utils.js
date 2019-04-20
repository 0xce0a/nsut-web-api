const jwt = require('jsonwebtoken');
const config = require('./config');
const verifyJWT = async token => {
	if (!token) {
		return { error: true, reason: 'no token provided' };
	}
	try {
		const decoded = await jwt.verify(token, config.jwt.secret);
		return { error: false, ...decoded };
	} catch (err) {
		return { error: true, reason: 'invalid token' };
	}
};

exports.verifyJWT = verifyJWT;
