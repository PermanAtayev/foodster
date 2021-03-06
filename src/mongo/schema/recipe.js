const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")
const ingredientSchema = require("./ingredient")

// TODO need to work on this one
let schema = new Schema({
    type: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
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
        type: ingredientSchema,
        required: false,
    }],
    instructions: {
        type: [String],
        required: false
    },
    nutrition: {
        type: nutiritionSchema,
        required: true
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = schema;