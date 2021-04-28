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

if (process.env.NODE_ENV === 'DEPLOYMENT') {
    conn_string = process.env.CONNECTION_STRING_DEPLOYMENT;
}

mongoose.connect(conn_string, connectionOptions);
mongoose.Promise = global.Promise;

let scrapedRecipes = require('../../playground/ar_small_v5.json');

let supportedDiets = [
    "vegan",
    "paleo",
    "keto",
    "vegetarian"
];


(async () => {
    for (let i = 0; i < scrapedRecipes.length; i++) {
        recipe = scrapedRecipes[i];
        console.log(i, recipe.name, recipe.rating);

        if (recipe.rating && recipe.rating.count && recipe.rating.value) {
            found_recipe = await Recipe.findOne({name: recipe.name}).exec();

            if (!found_recipe.rating) {
                try {
                    await Recipe.updateOne({name: recipe.name}, {rating: recipe.rating});
                } catch (e) {
                    console.log(e);
                }
            }

        }

    }

})
();

