const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

const model = mongoose.model('Todo', schema);
module.exports = model;
