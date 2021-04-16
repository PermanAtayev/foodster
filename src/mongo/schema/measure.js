const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mag: {
        type: Number,
        required: false
    },
    unit: {
        type: String,
        required: false
    }
})

module.exports = schema;