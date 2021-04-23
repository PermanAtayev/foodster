const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mealPlan: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "MealPlan"
    },
    date: {
        type: Date,
        required: true,
        default: null
    },
    meals: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal'
    }]
})

module.exports = schema;