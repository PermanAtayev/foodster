const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutritionSchema = require("./nutrition")

require("mongoose-type-email");

let schema = new Schema({
    inRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Recipe"
    }],
    // required by the frontend
    name: {
        type: String,
        required: true,
        default: null
    },
    imgUrl: {
        type: String,
        required: false,
        default: null
    },
    nutrition: {
        type: nutritionSchema,
        required: false,
        default: null
    },
    estimatedPrice: {
        type: Number,
        required: false,
        default: null
    }
})

module.exports = schema;