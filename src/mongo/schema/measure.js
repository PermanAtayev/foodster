const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO move the convTable to a hashmap in  the helper
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