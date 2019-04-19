let config = module.exports;

config.express = {
	port: process.env.PORT || '8080'
};
config.mongodb = {
	uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nsut-web-team'
};
config.jwt = {
	secret: 'thisisaveryunsafesecret'
};
