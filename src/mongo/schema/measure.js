const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    convTable: {
        type: JSON,
        require: false
    },
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