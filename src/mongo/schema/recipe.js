const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    type: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    imgPath: {
        type: String,
        required: false,
        default: ""
    },
    img: {
        type: Buffer,
        required: false
    },
    prep: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    servingSize: {
        type: Number,
        required: false,
        default: 1
    },
    ingredients: {
        type: [String],
        required: false
    },
    instructions: {
        type: [String],
        required: false
    },
    nutrition: {
        type: JSON,
        required: false
    },
    difficulty: {
        type: String,
        required: false
    }
});

module.exports = schema;