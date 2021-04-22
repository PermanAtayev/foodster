const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = require('./preference')

require('mongoose-type-email');
require('mongoose-type-url');


let schema = new Schema({
    // fields required by the front end.
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    password: {type: String, required: true},
    token: {type: String, required: false},
    permissions: {type: [String], required: false},
    age: {type: Number, required: false},
    gender: {type: String, required: false},
    height: {type: Number, required: false}, // in cm
    weight: {type: Number, required: false}, // in kg
    imgUrl: {type: mongoose.SchemaTypes.Url, required: false},
    allergies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: false
    }],
    isVerified: {type: Boolean, required: true, default: false},
    preferences: {type: preferenceSchema, required: false, default: null},
    likedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: false
    }],
    // dislikedRecipes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Recipe",
    //     required: false
    // }]
});


module.exports = schema;