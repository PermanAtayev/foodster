const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")
const edibleSchema = require('./edible')

let schema = new Schema({
    category: {
        type: String,
        required: false,
        default: null
    },
    // Do we need images if all recipes is already storing them?
    // img: {
    //     type: Buffer,
    //     required: false
    // },
    servingSize: {
        type: Number,
        required: false,
        default: 1
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // required by front end
    name: {
        type: String,
        required: true,
        unique: true
    },
    prepTime: {
        type: Number,
        required: true,
        default: null
    },
    cookTime: {
        type: Number,
        required: true,
        default: null
    },
    imgUrl: {
        type: String,
        required: false,
        default: null
    },
    instructions: [{
        type: String,
        required: false,
        default: null
    }],
    nutrition: {
        type: nutiritionSchema,
        required: false,
        default: null
    },
    estimatedPrice: {
        type: Number,
        default: null
    },
    ingredients: [{
        type: edibleSchema,
        required: false,
    }],
    tags: [{
        type: String,
        required: false,
        default: null
    }]
});

module.exports = schema;