const mongoose = require('mongoose');
const schema = require('../schema/recipe');

const Nutrition = require('./nutrition');
const Measure = require('./measure');
const Ingredient = require("./ingredient");
const Edible = require("./edible");


const commonTempTolarance = 200;

const calorieTolarance = commonTempTolarance;
const carbsTolarance = commonTempTolarance;
const proteinTolarance = commonTempTolarance;
const fatTolarance = commonTempTolarance;

// TODO, do we need this functionality
schema.statics.findRecipeWithNutritions = async (type, calories, protein, carbs, fat) => {
    try {
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


// TODO does not return the expected value
schema.statics.findByName = async (recipe_name) => {
    return Recipe.findOne({name: recipe_name}).exec();
}

// TODO test after the last remodeling
// TODO can be redone later

function getQuantity(nutrition) {
    return (nutrition ? nutrition.quantity : null);
}

function getUnit(nutrition) {
    return (nutrition ? nutrition.unit : null);
}

schema.statics.addRecipe = async (recipe) => {
    let nutrition = recipe.nutrition
    recipeNutrition = new Nutrition({
        calories: {
            mag: getQuantity(nutrition.calories),
            unit: getUnit(nutrition.calories)
        },
        carbs: {
            mag: getQuantity(nutrition.carbohydrateContent),
            unit: getUnit(nutrition.carbohydrateContent)
        },
        proteins: {
            mag: getQuantity(nutrition.proteinContent),
            unit: getUnit(nutrition.proteinContent)
        },
        fats: {
            mag: getQuantity(nutrition.fatContent),
            unit: getUnit(nutrition.fatContent)
        },
        micros: null
    });

    let newRecipe = new Recipe({
        name: recipe.name,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        imgUrl: recipe.imgUrl,
        instructions: recipe.instructions,
        nutrition: recipeNutrition,
        estimatedPrice: null,
        tags: recipe.tags,
        ingredients: []
    });

    var ingredients = [];
    let measures = [];

    for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];

        let name = null, imgUrl = null, nutrition = null, estimatedPrice = null;
        let mag = null, unit = null;

        ingredient.entities.forEach(description => {
            if (description.label === "NAME") {
                name = description.text;
            } else if (description.label === "QUANTITY") {
                mag = description.text;
            } else if (description.label === "UNIT") {
                unit = description.text;
            }
        })
        const ingredientInDb = await Ingredient.findByName(name);

        if (!ingredientInDb) {
            const newIngredient = new Ingredient({
                name,
                imgUrl,
                nutrition,
                estimatedPrice
            });

            ingredients.push(newIngredient);
            try {
                await newIngredient.save();
            } catch (e) {
                console.log(e);
            }
        } else {
            ingredients.push(ingredientInDb);
        }

        measures.push(new Measure({
            mag,
            unit
        }));
    };

    // add the ingredients' ids to the recipe's ingredient section
    for (let i = 0; i < ingredients.length; i++) {
        const newEdible = new Edible({
            ingredient: ingredients[i]._id,
            measure: measures[i]
        });
        newRecipe.ingredients.push(newEdible);
    }

    let newRecipeID = 0;

    // create a link from ingredients to recipes
    try {
        await newRecipe.save();
        newRecipeID = newRecipe._id;

        console.log(`The recipe is saved by name ${newRecipe.name}`);

        for (let i = 0; i < ingredients.length; i++) {
            console.log(ingredients[i].name + ` is linked to ${newRecipe.name}`);
            try {
                ingredients[i].inRecipes.push(newRecipeID);
                ingredients[i].save();
            } catch (e) {
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;