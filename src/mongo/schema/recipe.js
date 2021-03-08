const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")
const ingredientInRecipeSchema = require("./ingredientInRecipe")

// TODO need to work on this one
let schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    imgPath: {
        type: String,
        required: false,
        default: ""
    },
    img: {
        type: Buffer,
        required: false
    },
    prepTime: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    servingSize: {
        type: Number,
        required: false,
        default: 1
    },
    ingredients: [{
        type: ingredientInRecipeSchema,
        required: false,
    }],
    instructions: {
        type: [String],
        required: false
    },
    nutrition: {
        type: nutiritionSchema,
        required: false
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    numberOfLikes: {
        type: Number,
        default: 0
    }
});

module.exports = schema;