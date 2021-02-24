const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
})

module.exports = schema;