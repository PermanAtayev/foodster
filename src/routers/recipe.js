const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const migrateRecipe = require('../_helpers/s3_manager');
const cache = require("../middleware/cache");
const constants = require("../data/constants");

// The cache will be alive for 1 hour

router.get('/recipes/migrateAll', auth, permission('migrateAll'), async (req, res) => {
    try {
        const allRecipes = await Recipe.find({}).select("name img img_path");
        for (const recipe of allRecipes) {
            if (!recipe.img_path) {
                await migrateRecipe(recipe);
            }
        }
        return res.status(201).send("All migrated");
    } catch (err) {
        return res.status(406).send(err + "");
    }
});

router.get('/recipes/migrateToS3', auth, permission('migrateToS3'), async (req, res) => {
    try {
        // getting recipe
        const recipe = await Recipe.findRecipeWithName(req.body.recipe_name);

        if (!recipe)
            return res.status(404).send("Recipe was not found");

        await migrateRecipe(recipe);
        return res.status(201).send("Recipe's image is migrated to S3");
    } catch (e) {
        res.status(406).send(e + "");
    }
});

router.post('/recipes/nameFilter', auth, async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Find details of a recipe using its name'
    */
    try {
        const recipe = await Recipe.findByName(req.body.name);
        if (recipe) {
            // if the image is migrated to s3, then it should not be sent as a response
            if (recipe.imgPath !== "") {
                delete recipe.img;
            }
            return res.status(201).send(recipe);
        } else
            res.status(404).send("Recipe with this name is not found");
    } catch (e) {
        res.status(406).send(e + "Something went wrong with finding a recipe");
    }
});

router.post('/recipes/nutritionFilter', auth, async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Filter a recipe according to its nutritional info'
    */
    try {
        const recipeFilter = req.body;
        const recipe = await Recipe.findRecipeWithNutritions(recipeFilter.type, recipeFilter.calories, recipeFilter.protein, recipeFilter.carbs, recipeFilter.fat);
        if (recipe)
            return res.status(201).send(recipe);
        else
            return res.status(404).send("Recipe with required nutritions was not found");
    } catch (e) {
        return res.status(406).send("Something went wrong with find a recipe");
    }
});

// TODO test
// TODO document
router.post('/recipes/addRecipe', async (req, res) => {
    const newRecipe = req.body;

    try {
        Recipe.addRecipe(newRecipe);
        return res.status(201).send("Recipe is added");
    } catch (e) {
        return res.status(400).send("Did not add the recipe");
    }
})

// TODO test
// TODO document
// query string parameter limit can be passed, otherwise the default value would be provided
router.get('/recipes/getRecipeRecommendation', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    const recommendedRecipes = await req.user.recommendRecipes(req.query.limit || constants.RECOMMENDATION_LIMIT);
    res.status(200).send(JSON.stringify(recommendedRecipes));
})

router.get('/recipes/:recipeName', cache(constants.CACHEPERIOD), async (req, res) => {
    try {
        const recipe = await Recipe.findByName(req.params.recipeName);
        return res.status(200).send(recipe);
    } catch (e) {
        return res.status(404).send("The recipe is not found. " + e);
    }
})

function min(a, b) {
    return (a < b) ? a : b;
}

// TODO test
// TODO document
// Need to optimise with the cache / timestamps to not produce results too often.
router.get('/recipes/top/:numberOfRecipes', cache(constants.CACHEPERIOD), async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Endpoint to get top K recipes for the moment when user signup happens'
*/
    /*
        #swagger.responses[200] = {
            schema: {
                "imgPath": "",
                "servingSize": 4,
                "instructions": [
                    "Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"
                ],
                "likedUsers": [],
                "numberOfLikes": 0,
                "_id": "606c754439dada0e70e438d4",
                "type": "lunch",
                "name": "A",
                "prepTime": 55,
                "cookTime": 35,
                "ingredients": [
                    {
                        "_id": "606c754439dada0e70e438d5",
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "pepper",
                        "originID": "606c754339dada0e70e438d2"
                    },
                    {
                        "_id": "606c754439dada0e70e438d6",
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "sugar",
                        "originID": "606c754439dada0e70e438d3"
                    }
                ],
                "__v": 0
            }
        }
    */


    const kTopRecipesNumber = req.params.numberOfRecipes;
    const availableRecipes = await Recipe.countDocuments({});
    const returnNumber = min(availableRecipes, kTopRecipesNumber);
    const topRecipes = await Recipe.find({}).sort({numberOfLikes: -1});
    const kTopRecipes = topRecipes.slice(0, returnNumber);
    res.status(200).send(kTopRecipes);
})

// TODO implement
// TODO test
// TODO document
// Do we need this?
router.post('/recipes/prefillRecipes', async (req, res) => {
    const dummyRecipes = require('../data/recipes');

    await Recipe.insertMany(dummyRecipes, (err, docs) => {
        if (err) {
            console.log(err);
        }
        if (docs) {
            console.log(docs);
        }
    })
})


module.exports = router;