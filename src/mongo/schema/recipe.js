const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    type: {type: String, required: true},
    name: {type:String, required: true},
    url: {type: URL, required: false},
    // everything that is related to height, weight, age etc will go here.
    img: {type:Buffer, required: false},
    total_time: {type: String, required: false},
    serving_size: {type: Number, required: false},
    ingredients: {type: [String], required: false},
    instructions: {type: [String], required: false},
    nutritions: {type: JSON, required: false}
});

module.exports = schema;