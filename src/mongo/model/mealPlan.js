const mongoose = require('mongoose');
const schema = require('../schema/mealPlan');

const MealPlan = mongoose.model("MealPlan", schema);
module.exports = MealPlan;