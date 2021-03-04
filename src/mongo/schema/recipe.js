const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")

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
    prep: {
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
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Ingredient"
    }],
    instructions: {
        type: [String],
        required: false
    },
    nutrition: {
        type: nutiritionSchema,
        required: true
    },
    difficulty: {
        type: String,
        required: false
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = schema;