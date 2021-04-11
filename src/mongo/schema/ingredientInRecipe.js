const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutritionSchema = require('./nutrition')
const measureSchema = require('./measure')

// TODO do we just get rid of this one?
let schema = new Schema({
    originID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
    },
    // required by the frontend
    ingredient: {
        name: {
            type: String,
            required: true
        },
        imgUrl: {
            type: mongoose.SchemaTypes.Url,
            default: null
        },
        nutrition: {
            type: nutritionSchema,
            default: null
        },
        estimatedPrice: {
            type: Number,
            default: null
        },
        labels: [{
            type: String,
            default: null
        }],
    },
    measure: {
        type: measureSchema,
        default: null
    }
})

module.exports = schema;