const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const measureSchema = require('./measure');

let schema = new Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true,
        default: null
    },
    measure: {
        type: measureSchema,
        required: true,
        default: null
    },
    description: {
        type: String,
        required: true,
        default: null
    },
})

module.exports = schema;