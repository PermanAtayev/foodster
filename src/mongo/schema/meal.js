const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const servingSchema = require('./serving')

let schema = new Schema({
    name: {
        type: String,
        required: false,
        default: null
    },
    servings: [{
        type: servingSchema,
        required: true,
        default: null
    }]
});

module.exports = schema;