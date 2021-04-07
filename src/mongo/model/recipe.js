const mongoose = require('mongoose');
const schema = require('../schema/recipe');

const Ingredient = require('../model/ingredient');

const commonTempTolarance = 200;

const calorieTolarance = commonTempTolarance;
const carbsTolarance = commonTempTolarance;
const proteinTolarance = commonTempTolarance;
const fatTolarance = commonTempTolarance;


schema.statics.findRecipeWithNutritions = async (type, calories, protein, carbs, fat) => {
    try {
        //console.log("type: " + type + ", caloeries: " + calories + ", protein: " + protein + ", carbs: " + carbs + ", fat: " + fat);
        return await Recipe.findOne({
            type: type
            , 'nutritions.calories': {$lt: calories + calorieTolarance, $gt: calories - calorieTolarance}
            , 'nutritions.protein': {$lt: protein + proteinTolarance, $gt: protein - proteinTolarance}
            , 'nutritions.carbohydrates': {$lt: carbs + carbsTolarance, $gt: carbs - carbsTolarance}
            , 'nutritions.fat': {$lt: fat + fatTolarance, $gt: fat - fatTolarance}
        });
    } catch (e) {
        throw new Error("Recipe could note find");
    }
}
schema.statics.findByName = async (recipe_name) => {
    try {
        return await Recipe.findOne({name: recipe_name}).exec();
    } catch (e) {
        throw Error(e + " something went wrong with finding a recipe");
    }
}

// TODO test
schema.statics.addRecipe = async (recipe) => {
    const recipeIngredients = recipe.ingredients;
    let ingredientsInDB = {};
    let ingredientsOutDBObj = [];


    // categorize whether ingredients already exist in DB or not
    for (let i = 0; i < recipeIngredients.length; i++) {
        const ingredient = recipeIngredients[i];
        const ingredientInDb = await Ingredient.findByName(ingredient.name);

        if (!ingredientInDb) {
            ingredientsOutDBObj.push(ingredient);
        } else {
            ingredientsInDB[ingredient.name] = ingredientInDb
        }
    }

    // create a document for every ingredient that does not exist in db
    for (let i = 0; i < ingredientsOutDBObj.length; i++) {
        try {
            const ingredient = new Ingredient(ingredientsOutDBObj[i]);
            await ingredient.save();
            ingredientsInDB[ingredient.name] = ingredient
        } catch (e) {
            throw(e);
        }
    }

    // add the ingredients' ids to the recipe's ingredient section
    for (let i = 0; i < recipe.ingredients.length; i++) {
        const currentIngredient = recipe.ingredients[i];
        recipe.ingredients[i]["originID"] = ingredientsInDB[currentIngredient.name]._id;
    }

    let newRecipeID = 0;

    // create a link from ingredients to recipes
    try {
        const newRecipe = new Recipe(recipe);
        await newRecipe.save();
        newRecipeID = newRecipe._id;

        for (let i = 0; i < recipe.ingredients.length; i++) {
            const currentIngredient = recipe.ingredients[i];
            ingredientsInDB[currentIngredient.name].inRecipes.push(newRecipeID);
            await ingredientsInDB[currentIngredient.name].save();
        }
    } catch (e) {
        throw(e);
    }
}

const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;