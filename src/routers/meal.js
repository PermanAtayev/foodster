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
        res.send(mealPlan);
    }
    catch(e){
        res.status(400).send(e + "");
    }
})

module.exports = router;