const mongoose = require('mongoose');
const schema = require('../schema/nutrition');

schema.methods.toJSON = function() {
    let nutrition = this.toObject()
    delete nutrition.calories._id
    delete nutrition.carbs._id
    delete nutrition.proteins._id
    delete nutrition.fats._id
    return nutrition
}


const Nutrition = mongoose.model("Nutrition", schema);
module.exports = Nutrition;