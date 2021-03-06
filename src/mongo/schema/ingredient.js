const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")

let schema = new Schema({
    name: {
        type: String,
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