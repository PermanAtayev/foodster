const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
    // this is used for population, ref refers to Recipe model
    // check out: https://mongoosejs.com/docs/populate.html for more details
    inRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }],
    nutrition: {
        type: nutiritionSchema,
        required: true
    },
    estimatedPrice: {
        type: Number,
        required: false
    },
    labels: {
        type: [String],
        required: false
    }
})

module.exports = schema;