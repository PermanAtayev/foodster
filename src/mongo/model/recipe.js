const mongoose = require('mongoose');
const schema = require('../schema/recipe');

const calorieTolarance = 20;
const carbsTolarance = 20;
const proteinTolarance = 20;
const fatTolarance = 20;


schema.statics.findRecipeWithNutritions = async (type, calories, protein, carbs, fat) => {
    try{
        //console.log("type: " + type + ", caloeries: " + calories + ", protein: " + protein + ", carbs: " + carbs + ", fat: " + fat);
        const recipe = await Recipe.findOne({ type: type
                                    , 'nutritions.calories': { $lt: calories +  calorieTolarance, $gt: calories - calorieTolarance}
                                    , 'nutritions.protein': { $lt: protein +  proteinTolarance, $gt: protein - proteinTolarance}
                                    , 'nutritions.carbohydrates': { $lt: carbs +  carbsTolarance, $gt: carbs - carbsTolarance}
                                    , 'nutritions.fat': { $lt: fat +  fatTolarance, $gt: fat - fatTolarance}});
        return recipe;
    }catch(e){
        throw new Error("Recipe could note find");
    }
}
schema.statics.findRecipeWithName = async (recipe_name) => {
    try{
        const recipe = await Recipe.findOne({ name: recipe_name}).exec();
        return recipe;
    }catch(e){
        console.log("exception: " + e);
        return null;
    }
}
const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;