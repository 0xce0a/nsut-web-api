const app = require('./index');
const config = require('./config');

app.listen(config.express.port, () => {
	console.log(`server started on ${config.express.port}`);
});
