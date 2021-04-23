const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const measureSchema = require('./measure')

let schema = new Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
    measure: {
        type: measureSchema,
        required: true,
        default: null
    }
})

module.exports = schema;