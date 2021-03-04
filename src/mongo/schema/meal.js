const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const servingSchema = require('./serving')

let schema = new Schema({
    label: {
        type: String,
        required: true
    },
    servings: {
        type: [servingSchema],
        required: true
    }
});

module.exports = schema;