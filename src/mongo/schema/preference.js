const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    mealsPerDay: {
        type: Number,
        required: false,
        default: null
    },
    mealPlanDuration: {
        type: Number,
        required: false,
        default: null
    },
    calRange: [{
        type: Number,
        required: false,
        default: null
    }],
    protRange: [{
        type: Number,
        required: false,
        default: null
    }],
    fatRange: [{
        type: Number,
        required: false,
        default: null
    }],
    carbRange: [{
        type: Number,
        required: false,
        default: null
    }],
    costRange: [{
        type: Number,
        required: false,
        default: null
    }],
    dietType: {
        type: String,
        required: false,
        default: null
    },
    cookingTime: [{
        type: Number,
        required: false,
        default: null
    }]
})

// TODO test this thoroughly, so that problems in other fields do not occur.
// The fields that are deleted here will be hidden when the preference model is returned back
schema.methods.toJSON = function() {
    let preference = this.toObject()
    delete preference._id
    return preference
}


module.exports = schema;