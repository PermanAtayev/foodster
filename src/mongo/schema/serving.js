const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const measureSchema = require('./measure')

let schema = new Schema({
    recipe: {
        type: String,
        required: true
    },
    measure: {
        type: measureSchema,
        required: true
    }
})

module.exports = schema;