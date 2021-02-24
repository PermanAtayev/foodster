const mongoose = require('mongoose');
const schema = require('../schema/recipe');

const commonTempTolarance = 200;

const calorieTolarance = commonTempTolarance;
const carbsTolarance = commonTempTolarance;
const proteinTolarance = commonTempTolarance;
const fatTolarance = commonTempTolarance;


schema.statics.findRecipeWithNutritions = async (type, calories, protein, carbs, fat) => {
    try{
        //console.log("type: " + type + ", caloeries: " + calories + ", protein: " + protein + ", carbs: " + carbs + ", fat: " + fat);
        return await Recipe.findOne({
            type: type
            , 'nutritions.calories': {$lt: calories + calorieTolarance, $gt: calories - calorieTolarance}
            , 'nutritions.protein': {$lt: protein + proteinTolarance, $gt: protein - proteinTolarance}
            , 'nutritions.carbohydrates': {$lt: carbs + carbsTolarance, $gt: carbs - carbsTolarance}
            , 'nutritions.fat': {$lt: fat + fatTolarance, $gt: fat - fatTolarance}
        });
    }catch(e){
        throw new Error("Recipe could note find");
    }
}
schema.statics.findRecipeWithName = async (recipe_name) => {
    try{
        return await Recipe.findOne({name: recipe_name}).exec();
    }
    catch(e){
        throw Error(e + " something went wrong with finding a recipe");
    }
}
const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;