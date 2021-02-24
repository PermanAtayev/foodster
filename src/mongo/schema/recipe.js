const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    type: {type: String, required: false},
    name: {type:String, required: true},
    url: {type: String, required: false},
    img_path: {type: String, required: false},
    img: {type:Buffer, required: false},
    total_time: {type: String, required: false},
    serving_size: {type: Number, required: false},
    ingredients: {type: [String], required: false},
    instructions: {type: [String], required: false},
    nutritions: {type: JSON, required: false}
});

module.exports = schema;