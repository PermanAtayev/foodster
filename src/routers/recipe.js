const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const migrateRecipe = require('../_helpers/s3_manager');
const cache = require("../middleware/cache");
const constants = require("../data/constants");

// TODO migrate should not be an endpoint
// TODO test
router.get('/recipes/migrate_all', auth, permission('migrateAll'), async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint to transport the images of all the remaining recipes to S3 storage'
        #swagger.responses[201] = {
            schema: {
                "text" : "All migrated"
            }
        }
        #swagger.responses[406] = {
            schema: {
                "text" : "Database error:  [error]"
            }
        }
        #swagger.responses[403] = {
            schema: {
                "text" : "Permission Denied!"
            }
        }
    */
    try {
        const allRecipes = await Recipe.find({}).select("name img img_path");
        for (const recipe of allRecipes) {
            if (!recipe.img_path) {
                await migrateRecipe(recipe);
            }
        }
        return res.status(201).send("All migrated");
    } catch (err) {
        return res.status(406).send("Databse error : " + err);
    }
});

// TODO migrate should not be an endpoint
// TODO test
router.get('/recipes/migrate_to_s3', auth, permission('migrateToS3'), async (req, res) => {
    /* 
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint to transport the image of a recipe to S3 storage'
        #swagger.parameters['recipe_name'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'string',
            schema: {
                "recipe_name": "Menemen"
            }
         }
        #swagger.responses[201] = {
            schema: {
                "text" : "All migrated"
            }
        }
        #swagger.responses[406] = {
            schema: {
                "text" : "Database error:  [error]"
            }
        }
        #swagger.responses[404] = {
            schema: {
                "text" : "Recipe was not found"
            }
        }
        #swagger.responses[403] = {
            schema: {
                "text" : "Permission Denied!"
            }
        }
    */
    try {
        // getting recipe
        const recipe = await Recipe.findRecipeWithName(req.body.recipe_name);

        if (!recipe)
            return res.status(404).send("Recipe was not found");

        await migrateRecipe(recipe);
        return res.status(201).send("Recipe's image is migrated to S3");
    } catch (e) {
        res.status(406).send("Database error: " + e);
    }
});


// TODO test
router.post('/recipes/nutrition_filter', auth, async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint to find a recipe with nutrition constraints'
        #swagger.parameters['type'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'string',
            schema: {
                example: 'Breakfast'
            }
         }
          #swagger.parameters['calories'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'integer',
            schema: {
                example: 2000
            }
         }
         #swagger.parameters['protein'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'integer',
            schema: {
                example: 200
            }
         }
         #swagger.parameters['carbs'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'integer',
            schema: {
                example: 100
            }
         }
         #swagger.parameters['fat'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'integer',
            schema: {
                example: 50
            }
         }
        #swagger.responses[201] = {
            schema: {
                    "imgPath": "",
                    "servingSize": 4,
                    "instructions": ["Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"],
                    "likedUsers": [{
                        "$oid": "user_id"
                    }],
                    "numberOfLikes": 2,
                    "type": "lunch",
                    "name": "C",
                    "prepTime": 55,
                    "cookTime": 35,
                    "ingredients": [{
                        "_id": {
                            "$oid": "ingredient_id"
                        },
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "pepper",
                        "originID": {
                            "$oid": "ingredient_original_id"
                        }
                    }, {
                        "_id": {
                            "$oid": "ingredient_id2"
                        },
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "sugar",
                        "originID": {
                            "$oid": "ingredient_original_id2"
                        }
                    }],
                    "__v": 1
                    }
        }
        #swagger.responses[406] = {
            schema: {
                "text" : "Something went wrong with find a recipe"
            }
        }
        #swagger.responses[404] = {
            schema: {
                "text" : "Recipe with required nutritions was not found"
            }
        }
        #swagger.responses[403] = {
            schema: {
                "text" : "Permission Denied!"
            }
        }
    */
    try {
        const recipeFilter = req.body;
        const recipe = await Recipe.findRecipeWithNutritions(recipeFilter.type, recipeFilter.calories, recipeFilter.protein, recipeFilter.carbs, recipeFilter.fat);
        if (recipe)
            return res.status(201).send(recipe);
        else
            return res.status(404).send("Recipe with required nutritions was not found");
    } catch (e) {
        return res.status(406).send("Something went wrong with finding a recipe");
    }
});

// TODO test
router.post('/recipes', auth, async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint to add a recipe'
        #swagger.parameters['name'] = {
            in: 'body',
            description: 'Recipe name',
            required: true,
            type: 'string',
            schema: {
                    "name": "Menemen"
            }
        }
        #swagger.parameters['prepTime'] = {
            in: 'body',
            description: 'Recipe preperation time',
            required: true,
            type: 'integer',
            schema: {
                    "prepTime": 30
            }
        }
        #swagger.parameters['cookTime'] = {
            in: 'body',
            description: 'Recipe cook time',
            required: true,
            type: 'integer',
            schema: {
                    "cookTime": 50
            }
        }
        #swagger.responses[201] = {
            schema: {
                "text" : "Recipe is added"
            }
        }
        #swagger.responses[400] = {
            schema: {
                "text" : "Did not add the recipe"
            }
        }
    */
    const newRecipe = req.body;
    try {
        Recipe.addRecipe(newRecipe);
        return res.status(201).send("Recipe is added");
    } catch (e) {
        return res.status(400).send("Did not add the recipe");
    }
})


// TODO test
// query string parameter limit can be passed, otherwise the default value would be provided
router.get('/recipes/recommendation', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint for a user to get a Recipe / meal recommendation. If user has saved information about the preferred number of meals per day, that \
number will be used. Otherwise if limit is passed as a path parameter it will be used. If that is also not passed, then a constant number 3 will be used.'

        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'maximum number of recipes to return',
            required: false,
            type: 'string',
            schema: {
                "limit":"2"
            }
         }

        #swagger.responses[200] = {
            description: "List of recipe names is returned"
        }
    */

    let preferenceNumberFromUser = null;

    if ('preferences' in req.user) {
        if ('mealsPerDay' in req.user.preferences) {
            preferenceNumberFromUser = req.user.preferences.mealsPerDay;
        }
    }

    const recommendedRecipes = await req.user.recommendRecipes(req.query.limit || preferenceNumberFromUser || constants.RECOMMENDATION_LIMIT);
    res.status(200).json(recommendedRecipes);
})

// TODO document
router.get('/recipes/:recipeName', cache(constants.CACHEPERIOD), async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint to find a recipe with it's name'
        #swagger.parameters['name'] = {
            in: 'query',
            description: 'Recipe name',
            required: true,
            type: 'string',
            schema: {
                "name": "Menemen"
            }
         }
        #swagger.responses[201] = {
            schema: {
                        "imgPath": "",
                        "servingSize": 4,
                        "instructions": ["Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"],
                        "likedUsers": [{
                            "$oid": "user_id"
                        }],
                        "numberOfLikes": 2,
                        "type": "lunch",
                        "name": "C",
                        "prepTime": 55,
                        "cookTime": 35,
                        "ingredients": [{
                            "_id": {
                                "$oid": "ingredient_id"
                            },
                            "text": "1 tbsp of sugar and a lot of salt",
                            "unit": "tbsp",
                            "name": "pepper",
                            "originID": {
                                "$oid": "ingredient_original_id"
                            }
                        }, {
                            "_id": {
                                "$oid": "ingredient_id2"
                            },
                            "text": "1 tbsp of sugar and a lot of salt",
                            "unit": "tbsp",
                            "name": "sugar",
                            "originID": {
                                "$oid": "ingredient_original_id2"
                            }
                        }],
                        "__v": 1
                    }
        }
        #swagger.responses[406] = {
            schema: {
                "text" : "[error] Something went wrong with finding a recipe"
            }
        }
        #swagger.responses[404] = {
            schema: {
                "text" : "Recipe with this name is not found"
            }
        }
        #swagger.responses[403] = {
            schema: {
                "text" : "Permission Denied!"
            }
        }
    */
    try {
        const recipe = await Recipe.findByName(req.params.recipeName);
        return res.status(200).json(recipe);
    } catch (e) {
        return res.status(404).json(e + "");
    }
})

router.post('/recipes/like/:recipeName', auth, async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Endpoint for a user to like a recipe'

    #swagger.parameters['recipeName'] = {
        in: 'query',
        description: 'Name of the recipe to be liked',
        required: true,
        type: 'string',
        schema: {
            "recipeName": "Pasta with mozarella cheese"
        }
     }
    #swagger.responses[200] = {
        schema: {
            "text": "The meal is liked successfully"
        }
    }
    #swagger.responses[404] = {
        schema: {
            "text": "Recipe does not exist"
        }
    }
    #swagger.responses[400] = {
        schema: {
            "text": "The meal is already liked"
        }
    }
*/
    try {
        const user = req.user;
        let mealIsAlreadyLiked = false;
        const recipeName = req.params.recipeName;

        const recipe = await Recipe.findByName(recipeName);

        if (!recipe) {
            return res.status(404).send("Recipe does not exist");
        }

        if (user.likedRecipes !== null) {
            if (user.likedRecipes.includes(recipe._id)) {
                mealIsAlreadyLiked = true;
            }
        }
        if (!mealIsAlreadyLiked) {
            user.likedRecipes.push(recipe._id);
            user.save();

            recipe.numberOfLikes = recipe.numberOfLikes + 1;
            recipe.likedUsers.push(user._id);
            recipe.save();

            return res.status(200).send("The meal is liked successfully");
        } else {
            return res.status(400).send("The meal is already liked");
        }
    } catch (error) {
        return res.status(400).send(error);
    }
})

// TODO document
// Useful to get all recipes
router.get('/recipes', cache(constants.CACHEPERIOD), async (req, res) => {
    /*
        #swagger.tags = ['Recipe']
        #swagger.description = 'Endpoint for a user to get a Recipe / meal recommendation. If user has saved information about the preferred number of meals per day, that \
number will be used. Otherwise if limit is passed as a path parameter it will be used. If that is also not passed, then a constant number 3 will be used.'


        #swagger.responses[200] = {
            description: "the List of all recipe names is returned"
        }
        #swagger.responses[400] = {
            description: "Either no recipe or no authorization"
        }

    */
    try {
        const recipeList = await Recipe.find({});
        return res.status(200).send(recipeList);
    } catch (e) {
        return res.status(400).send("Either no recipe or no authorization");
    }
})


function min(a, b) {
    return (a < b) ? a : b;
}

// TODO test
// Need to optimise with the cache / timestamps to not produce results too often.
router.get('/recipes/top/:numberOfRecipes', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Endpoint to get top K recipes for the moment when user signup happens'
    #swagger.parameters["numberOfRecipes"] = {
        in: 'path',
        description: 'Number of recipes',
        required: true,
        type: 'integer',
        schema: {
                example: 15
        }
    }
    #swagger.responses[200] = {
        schema: [
            {
                "imgPath": "",
                "servingSize": 4,
                "instructions": [
                    "Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"
                ],
                "likedUsers": [],
                "numberOfLikes": 0,
                "_id": "recipe_id",
                "type": "lunch",
                "name": "A",
                "prepTime": 55,
                "cookTime": 35,
                "ingredients": [
                    {
                        "_id": "ingredient_id1",
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "pepper",
                        "originID": "ingredient_original_id1"
                    },
                    {
                        "_id": "ingredient_id2",
                        "text": "1 tbsp of sugar and a lot of salt",
                        "unit": "tbsp",
                        "name": "sugar",
                        "originID": "ingredient_original_id2"
                    }
                ],
                "__v": 0
            }
        ]
    }
    */
    const kTopRecipesNumber = req.params.numberOfRecipes;
    const availableRecipes = await Recipe.countDocuments({});
    const returnNumberOfRecipes = min(availableRecipes, kTopRecipesNumber);
    const topRecipes = await Recipe.find({}).sort({numberOfLikes: -1});
    const kTopRecipes = topRecipes.slice(0, returnNumberOfRecipes);
    res.status(200).send(kTopRecipes);
})

// TODO implement
// TODO test
// Do we need this?
router.post('/recipes/prefill', auth, async (req, res) => {
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Endpoint to add the recipes in local to db'
    #swagger.responses[200] = {
        schema: {
            "text" : "Recipes are added!"
        }
    }
    */
    const dummyRecipes = require('../data/recipes');

    await Recipe.insertMany(dummyRecipes, (err, docs) => {
        if (err) {
            console.log(err);
        }
        if (docs) {
            console.log(docs);
        }
    })
    return res.status(200).send("Recipes are added!");
})


module.exports = router;