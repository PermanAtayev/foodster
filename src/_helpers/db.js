const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || process.env.CONNECTION_STRING, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../mongo/model/user')
};