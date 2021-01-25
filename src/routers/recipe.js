const express = require('express');
const router = express.Router();
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');

router.post('/recipe/nameFilter', auth, async (req, res) =>{
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