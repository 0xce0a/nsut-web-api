const app = require('./index');
const config = require('./config');
const mongoose = require('mongoose');
mongoose
	.connect(config.mongodb.uri, { useNewUrlParser: true })
	.then(res => {
		console.log('connected!!');
	})
	.catch(err => {
		console.log(err);
	});
app.listen(config.express.port, () => {
	console.log(`server started on ${config.express.port}`);
});
