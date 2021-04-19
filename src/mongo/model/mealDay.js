const mongoose = require('mongoose');
const schema = require('../schema/mealDay');

const MealDay = mongoose.model("MealDay", schema);
module.exports = MealDay;