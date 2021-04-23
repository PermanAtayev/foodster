const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = require('./preference')

require('mongoose-type-email');
require('mongoose-type-url');


let schema = new Schema({
    // fields required by the front end.
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    name: {type: String, required: false, default: null},
    surname: {type: String, required: false, default: null},
    password: {type: String, required: true},
    token: {type: String, required: false, default: null},
    permissions: {type: [String], required: false, default: null},
    age: {type: Number, required: false, default: null},
    gender: {type: String, required: false, default: null},
    height: {type: Number, required: false, default: null}, // in cm
    weight: {type: Number, required: false, default: null}, // in kg
    imgUrl: {type: mongoose.SchemaTypes.Url, required: false, default: null},
    allergies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: false,
        default: null
    }],
    isVerified: {type: Boolean, required: true, default: false},
    preferences: {type: preferenceSchema, required: false, default: null},
    likedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: false
    }],
});


module.exports = schema;