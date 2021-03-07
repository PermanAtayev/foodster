const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
let conn_string = process.env.CONNECTION_STRING_DEV;

if (process.env.NODE_ENV === 'test'){
    conn_string = process.env.CONNECTION_STRING_TEST;
}
if (process.env.NODE_ENV === 'DEV_LOCAL'){
    conn_string = process.env.CONNECTION_STRING_DEV_LOCAL;
}


mongoose.connect(conn_string, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = mongoose.connection;