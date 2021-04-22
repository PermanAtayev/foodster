const mongoose = require('mongoose');
const schema = require('../schema/nutrition');

const Nutrition = mongoose.model("Nutrition", schema);
module.exports = Nutrition;