const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const migrateRecipe = require('../_helpers/s3_manager');

router.get('/recipe/migrateAll', auth, permission('migrateAll'), async(req, res) => {
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

router.get('/recipe/migrateToS3', auth, permission('migrateToS3'), async(req, res) => {
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

router.post('/recipe/nameFilter', auth, async (req, res) =>{
    /*
    #swagger.tags = ['Recipe']
    #swagger.description = 'Find a recipe using its name'
    */
    try{
        const recipe = await Recipe.findRecipeWithName(req.body.recipe_name);
        if (recipe) {
            // if the image is migrated to s3, then it should not be sent as a response
            if (recipe.img_path !== "") {
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

router.post('/recipe/nutritionFilter', auth, async (req, res) =>{
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

module.exports = router;