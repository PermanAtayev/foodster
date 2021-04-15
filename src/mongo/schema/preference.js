const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mealsPerDay: {
        type: Number,
        required: false
    },
    mealPlanDuration: {
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
    fatRange: {
        type: [Number],
        required: false
    },
    carbRange: {
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
    cookingTime: {
        type: [Number],
        required: false
    }
})

// TODO test this thoroughly, so that problems in other fields do not occur.
// The fields that are deleted here will be hidden when the preference model is returned back
schema.methods.toJSON = function() {
    let preference = this.toObject()
    delete preference._id
    return preference
}


module.exports = schema;