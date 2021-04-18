const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mag: {
        type: Number,
        required: false,
        default: null
    },
    unit: {
        type: String,
        required: false,
        default: null
    }
})

module.exports = schema;