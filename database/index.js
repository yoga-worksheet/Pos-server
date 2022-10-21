const mongoose = require("mongoose");
const { dbHost, dbPort, dbUser, dbPass, dbName } = require("../app/config");
const URI = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(URI);
const db = mongoose.connection;

module.exports = db;