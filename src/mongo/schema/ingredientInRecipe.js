const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientGenericSchema = require('./ingredientGeneric');


let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    originID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
    },
// full ingredient text information
    text: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    }
})

module.exports = schema;