const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = require('./preference')

require('mongoose-type-email');
require('mongoose-type-url');


let schema = new Schema({
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    username: {type: String, required: false},
    password: {type: String, required: true},
    token: {type: String, required: false},
    permissions: {type: [String], required: false},
    age: {type: Number, required: false},
    gender: {type: String, required: false},
    height: {type: Number, required: false},
    imgUrl: {type: mongoose.SchemaTypes.Url, required: false},
    allergies: {type: [String], required: false},
    isVerified: {type: Boolean, required: true, default: false},
    preferences: {type: preferenceSchema, required: false},
    // this one contains all the recipes liked by a user and will need to be populated with actual recipes
    // whenever actual recipe info is needed
    likedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: false
    }],
    dislikedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: false
    }]
});


module.exports = schema;