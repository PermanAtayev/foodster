const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measureSchema = require('./measure')

let schema = new Schema({
    // required by front end
    base: {
        type: measureSchema,
        default: null
    },
    calories: {
        type: String,
        required: false
    },
    carbs: {
        type: String,
        required: false
    },
    proteins: {
        type: String,
        required: false
    },
    fats: {
        type: String,
        required: false
    },
    // If we end up having this data, needs to be changed to the format needed.
    micros: [{
        type: String,
        default: null
    }]
})

module.exports = schema;