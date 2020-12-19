const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');


let schema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type:String, required: true},
    token: {type: String, required: false},
    metadata: {type:JSON, required: false}
});


module.exports = schema;