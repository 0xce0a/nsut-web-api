const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		select: false
	},
	collaborators: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		select: false
	}
});

const model = mongoose.model('Todo', schema);
module.exports = model;
