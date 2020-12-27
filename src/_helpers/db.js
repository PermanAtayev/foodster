const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.CONNECTION_STRING_DEV, connectionOptions);
mongoose.Promise = global.Promise;

const db = mongoose.connection;


module.exports = db;