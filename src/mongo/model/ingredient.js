const mongoose = require('mongoose');
const schema = require('../schema/ingredientGeneric');

schema.statics.findByName = async(name) => {
    try {
        return await Ingredient.findOne({name: name});
    }
    catch(e){
        console.log(e);
    }
}


const Ingredient = mongoose.model("Ingredient", schema);
module.exports = Ingredient;