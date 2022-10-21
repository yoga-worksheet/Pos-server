const mongoose = require("mongoose");
const { dbHost, dbPort, dbUser, dbPass, dbName } = require("../app/config");
// const URI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
const URI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/?retryWrites=true&w=majority`;

mongoose.connect(URI);
const db = mongoose.connection;

module.exports = db;