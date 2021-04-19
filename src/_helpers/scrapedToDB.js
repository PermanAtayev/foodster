const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Recipe = require('../mongo/model/recipe');
const Nutrition = require('../mongo/model/nutrition');
const Measure = require('../mongo/model/measure');
const Ingredient = require("../mongo/model/ingredient");
const Edible = require("../mongo/model/edible");

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};
let conn_string = process.env.CONNECTION_STRING_DEV;

if (process.env.NODE_ENV === 'test') {
    conn_string = process.env.CONNECTION_STRING_TEST;
}
if (process.env.NODE_ENV === 'DEV_LOCAL') {
    conn_string = process.env.CONNECTION_STRING_DEV_LOCAL;
}

mongoose.connect(conn_string, connectionOptions);
mongoose.Promise = global.Promise;

let scrapedRecipes = require('../../playground/ar_small_v5.json');

function getQuantity(nutrition) {
    return (nutrition ? nutrition.quantity : null);
}

function getUnit(nutrition) {
    return (nutrition ? nutrition.unit : null);
}
(async () => {  // for recipes to be added one by one, top level async: https://stackoverflow.com/questions/46515764/how-can-i-use-async-await-at-the-top-level
    let recipesSaved = 0;
    for(i = 0; i < scrapedRecipes.length; i++){
        let recipe = scrapedRecipes[i];
        const recipeInDB = await Recipe.findOne({name: recipe.name}).exec();

        if (!recipeInDB) {
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
                imgUrl: recipe.imageUrl,
                instructions: recipe.instructions,
                nutrition: recipeNutrition,
                estimatedPrice: null,
                tags: recipe.tags,
                ingredients: []
            });

            var ingredients = [];
            let measures = [];
            let descriptions = [];
            for (let i = 0; i < recipe.ingredients.length; i++) {
                const ingredient = recipe.ingredients[i];

                let name = null, imgUrl = null, nutrition = null, estimatedPrice = null;
                let mag = null, unit = null;
                let description = "";
                ingredient.entities.forEach(ingredientDescription => {
                    description += " " + ingredientDescription.text;
                    if (ingredientDescription.label === "NAME") {
                        name = ingredientDescription.text;
                    } else if (ingredientDescription.label === "QUANTITY") {
                        mag = ingredientDescription.text;
                    } else if (ingredientDescription.label === "UNIT") {
                        unit = ingredientDescription.text;
                    }
                })
                descriptions.push(description);
                const ingredientInDb = await Ingredient.findOne({name: name}).exec();
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
                        console.log("Ingredient is created although it was already there");
                    }
                } else {
                    ingredients.push(ingredientInDb);
                }

                measures.push(new Measure({
                    mag,
                    unit
                }));
            }
            ;

            // add the ingredients' ids to the recipe's ingredient section
            for (let i = 0; i < ingredients.length; i++) {
                const newEdible = new Edible({
                    ingredient: ingredients[i]._id,
                    description: descriptions[i],
                    measure: measures[i]
                });
                newRecipe.ingredients.push(newEdible);
            }

            let newRecipeID = 0;

            // create a link from ingredients to recipes
            try {
                await newRecipe.save();
                newRecipeID = newRecipe._id;

                recipesSaved += 1;
                console.log(`The recipe number ${recipesSaved} is saved by name ${newRecipe.name}`);

                for (let i = 0; i < ingredients.length; i++) {
                    // console.log(ingredients[i].name + ` is linked to ${newRecipe.name}`);
                    try {
                        ingredients[i].inRecipes.push(newRecipeID);
                        await ingredients[i].save();
                    } catch (e) {
                        console.log("Ingredient overwrite");
                    }
                }
            } catch (e) {
                console.log("Recipe overwrite?");
            }
        }
    }
})();




