const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Todo'
		}
	],
	permissionedTodos: []
});

const model = mongoose.model('User', schema);

module.exports = model;
