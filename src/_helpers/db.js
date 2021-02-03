const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.CONNECTION_STRING_DEV, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = mongoose.connection;