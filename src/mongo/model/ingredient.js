const mongoose = require('mongoose');
const schema = require('../schema/ingredient');

schema.methods.toJSON = function() {
    let ingredient = this.toObject()
    delete ingredient.inRecipes
    delete ingredient.__v
    delete ingredient._id
    return ingredient
}

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