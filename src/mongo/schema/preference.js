const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mealsPerDay: {
        type: Number,
        required: false
    },
    calRange: {
        type: [Number],
        required: false
    },
    protRange: {
        type: [Number],
        required: false
    },
    costRange: {
        type: [Number],
        required: false
    },
    dietType: {
        type: [String],
        required: false
    },
    difficulty: {
        type: String,
        required: false
    },
    cookingTime: {
        type: [Number],
        required: false
    },
    restrictions: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Ingredient'
    }]
})

module.exports = schema;