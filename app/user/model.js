const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

const model = mongoose.model('Users', schema);

module.exports = model;
