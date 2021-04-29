const express = require('express');
const router = express.Router();
const Meal = require('../mongo/model/meal');
const auth = require('../middleware/auth');
const cache = require("../middleware/cache");
const constants = require("../data/constants");

router.post('/meals/generate',  auth, async(req, res) => {
    /*
    #swagger.tags = ['Meal']
    #swagger.description = 'generate a meal'
    */
    try{
        const planFilter = req.body;
        
        const mealPlan = await Meal.generateMealPlan(planFilter, req.user._id);
        // meal plan can be populated as the front end wants
        await mealPlan.populate("plan").execPopulate();
        await mealPlan.populate("plan.meals").execPopulate();
        await mealPlan.populate("plan.meals.servings.recipe").execPopulate();
        res.send(mealPlan);
    }
    catch(e){
        res.status(400).send(e + "");
    }
})

router.get('/meals',  auth, async(req, res) => {
    /*
    #swagger.tags = ['Meal']
    #swagger.description = 'get the meal'
    */
    try{
        const user = req.user;
        const mealPlan = await user.getMealPlan();
        await mealPlan.populate("plan").execPopulate();
        await mealPlan.populate("plan.meals").execPopulate();
        await mealPlan.populate("plan.meals.servings.recipe").execPopulate();
        res.send(mealPlan);
    }
    catch(e){
        res.status(400).send(e + "");
    }
})
module.exports = router;