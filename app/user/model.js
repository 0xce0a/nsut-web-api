const mongoose = require('mongoose');
const todoModel = require('../todo/model');
const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	todos: [todoModel.schema]
});

const model = mongoose.model('User', schema);

module.exports = model;
