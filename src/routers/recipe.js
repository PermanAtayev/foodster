const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const migrateRecipe = require('../_helpers/s3Manager');

router.get('/recipe/migrateAll', auth, permission('migrateAll'), async(req, res) => {
    try{
        const allRecipes = await Recipe.find({}).select("name img_path");
        for (const recipe of allRecipes) {
            if (!recipe.img_path){
                await migrateRecipe(recipe.name);
            }
        }
        return res.status(201).send("All migrated");
    }catch(err){
        return res.status(406).send(err + "");
    }
});

router.get('/recipe/migrateToS3', auth, permission('migrateToS3'), async(req, res) => {
    try{
        await migrateRecipe(req.body.recipe_name);
        return res.status(201).send("Recipe's image is migrated to S3");
    }catch(e){
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
        if (recipe)
            return res.status(201).send(recipe);
        else
            res.status(406).send( "recipe could not be found");
    }
    catch (e){
        res.status(406).send(e + "");
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
            res.status(406).send( "recipe could not be found");
    }
    catch (e){
        res.status(406).send(e + "");
    }
});

module.exports = router;