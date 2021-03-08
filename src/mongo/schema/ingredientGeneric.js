const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutritionSchema = require("./nutrition")

require("mongoose-type-email");

let schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: mongoose.SchemaTypes.Url,
        required: false
    },
    nutrition: {
        type: nutritionSchema,
        required: false
    },
    estimatedPrice: {
        type: Number,
        required: false
    },
    inRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Recipe"
    }]
})

module.exports = schema;