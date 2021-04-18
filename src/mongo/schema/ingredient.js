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
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
    nutrition: {
        type: nutritionSchema,
        required: false
    },
    estimatedPrice: {
        type: Number,
        required: false
    }
})

module.exports = schema;