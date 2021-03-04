const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const edibleSchema = require('edible');

let schema = new Schema({
    inventory: {
        type: [edibleSchema],
        required: false
    },
})

module.exports = schema;