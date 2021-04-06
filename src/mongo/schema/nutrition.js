const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    calories: {
        type: String,
        required: false
    },
    carbohydrateContent: {
        type: String,
        required: false
    },
    proteinContent: {
        type: String,
        required: false
    },
    fatContent: {
        type: String,
        required: false
    },
})

module.exports = schema;