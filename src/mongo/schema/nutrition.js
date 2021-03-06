const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    calories: {
        type: Number,
        required: false
    },
    carbs: {
        type: Number,
        required: false
    },
    proteins: {
        type: Number,
        required: false
    },
    fats: {
        type: Number,
        required: false
    }
})

module.exports = schema;