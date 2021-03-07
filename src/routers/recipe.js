const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const migrateRecipe = require('../_helpers/s3_manager');

router.get('/recipes/migrateAll', auth, permission('migrateAll'), async(req, res) => {
    try{
        const allRecipes = await Recipe.find({}).select("name img img_path");
        for (const recipe of allRecipes) {
            if (!recipe.img_path){
                await migrateRecipe(recipe);
            }
        }
        return res.status(201).send("All migrated");
    }catch(err){
        return res.status(406).send(err + "");
    }
});

router.get('/recipes/migrateToS3', auth, permission('migrateToS3'), async(req, res) => {
    try{
        // getting recipe
        const recipe = await Recipe.findRecipeWithName(req.body.recipe_name);

        if (!recipe)
            return res.status(404).send("Recipe was not found");

        await migrateRecipe(recipe);
        return res.status(201).send("Recipe's image is migrated to S3");
    }
    catch(e){
        res.status(406).send(e + "");
    }
});

router.post('/recipes/nameFilter', auth, async (req, res) =>{
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Find a recipe using its name'
    */
    try{
        const recipe = await Recipe.findByName(req.body.recipe_name);
        if (recipe) {
            // if the image is migrated to s3, then it should not be sent as a response
            if (recipe.imgPath !== "") {
                delete recipe.img;
            }
            return res.status(201).send(recipe);
        }
        else
            res.status(404).send( "Recipe with this name is not found");
    }
    catch (e){
        res.status(406).send(e + "Something went wrong with finding a recipe");
    }
});

router.post('/recipes/nutritionFilter', auth, async (req, res) =>{
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Filter a recipe according to its nutritional info'
    */
    try{
        const recipeFilter = req.body;
        const recipe = await Recipe.findRecipeWithNutritions(recipeFilter.type, recipeFilter.calories, recipeFilter.protein, recipeFilter.carbs, recipeFilter.fat);
        if (recipe)
            return res.status(201).send(recipe);
        else
            return res.status(404).send("Recipe with required nutritions was not found");
    }
    catch (e){
        return res.status(406).send("Something went wrong with find a recipe");
    }
});

// TODO implement
// TODO test
// TODO document
router.post('/recipes/addRecipe', async(req, res) => {
    const newRecipe = req.body;

    try {
        Recipe.addRecipe(newRecipe);
        return res.status(201).send("Recipe is added");
    }
    catch(e){
        return res.status(400).send("Did not add the recipe");
    }
})

router.post('/recipes/getRecipe', async(req, res) => {
    try {
        const recipe = await Recipe.findByName(req.body.name);
        return res.status(200).send(recipe);
    }
    catch(e){
        return res.status(404).send("The recipe is not found. " + e);
    }
})

// TODO implement
// TODO test
// TODO document
router.post('/recipes/prefillRecipes', async(req, res) => {
    const dummyRecipes = require('../data/recipes');

    await Recipe.insertMany(dummyRecipes, (err, docs) => {
        if(err){
            console.log(err);
        }
        if(docs){
            console.log(docs);
        }
    })
})


module.exports = router;