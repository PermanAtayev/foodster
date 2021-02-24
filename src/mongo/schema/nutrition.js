const mongoose = require('mongoose');
const Measure = require('./measure')
const Schema = mongoose.Schema;

let schema = new Schema({
    base: {
        type: Measure
    },

})

module.exports = schema;