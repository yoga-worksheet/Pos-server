const mongoose = require("mongoose");
const {
	dbHost,
	dbPort,
	dbUser,
	dbPass,
	dbName,
	mongoUri,
} = require("../app/config");
// const URI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
const URI = mongoUri;

mongoose.connect(URI);
const db = mongoose.connection;

module.exports = db;
