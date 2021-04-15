const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // needs to populated if you want the details of meals
    plan: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'MealDay'
    }]
})

module.exports = schema;