const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measureSchema = require('./measure')


// TODO shall micros stay like that?
let schema = new Schema({
    base: {
        type: measureSchema,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    proteins: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    micros: {
        type: JSON,
        required: false
    }

})

module.exports = schema;