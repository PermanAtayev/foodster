const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-type-email');

let schema = new Schema({
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    password: {type: String, required: true},
    token: {type: String, required: false},
    permissions: {type: [String], required: true},
    // everything that is related to height, weight, age etc will go here.
    metadata: {type:JSON, required: false},
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