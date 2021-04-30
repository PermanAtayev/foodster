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

let recipes = require('../../playground/lessThan150.json');


(async () => {
    for(let j = 0; j < recipes.length; j++) {
        for (var k in recipes[j]) {
            let recipe_name = k;
            found_recipe = await Recipe.findOne({name: recipe_name}).exec();

            if (!found_recipe.estimatedPrice && recipes[j][k]){
                try {
                    await Recipe.updateOne({name: recipe_name}, {estimatedPrice: recipes[j][k]});
                } catch (e) {
                    console.log(e);
                }

                console.log(`${found_recipe.name} is updated`);
            }
        }
    }
})
();

