const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-type-email');


let schema = new Schema({
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    password: {type: String, required: true},
    token: {type: String, required: false},
    permissions: {type: [String], required: true},
    // everything that is related to height, weight, age etc will go here.
    metadata: {type:JSON, required: false} 
});


module.exports = schema;