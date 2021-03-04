const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const measureSchema = require('measure');

let schema = new Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient',
        required: true
    },
    measure: {
        type: measureSchema,
        required: true
    }
})

module.exports = schema;