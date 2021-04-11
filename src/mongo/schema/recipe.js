const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutiritionSchema = require("./nutrition")
const edibleSchema = require('./edible')

//TODO check if there are any side effects because of the changes made
let schema = new Schema({
    type: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    img: {
        type: Buffer,
        required: false
    },
    servingSize: {
        type: Number,
        required: false,
        default: 1
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    numberOfLikes: {
        type: Number,
        default: 0
    },
    // required by front end
    prep: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: false,
        default: null
    },
    instructions: [{
        type: String,
        required: false
    }],
    nutrition: {
        type: nutiritionSchema,
        required: false
    },
    estimatedPrice: {
        type: Number,
        default: null
    },
    ingredients: [{
        type: edibleSchema,
        required: false,
    }]

});

module.exports = schema;