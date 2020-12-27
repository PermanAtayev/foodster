const mongoose = require('mongoose');
const schema = require('../schema/recipe');

const Recipe = mongoose.model("Recipe", schema);

module.exports = Recipe;