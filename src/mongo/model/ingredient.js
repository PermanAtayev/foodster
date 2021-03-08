const mongoose = require('mongoose');
const schema = require('../schema/ingredientGeneric');

schema.statics.findByName = async(name) => {
    try {
        return Ingredient.findOne({name: name});
    }
    catch(e){
        console.log(e);
        return null;
    }
}


const Ingredient = mongoose.model("Ingredient", schema);
module.exports = Ingredient;