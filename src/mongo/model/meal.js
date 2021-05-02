const mongoose = require('mongoose');
const schema = require('../schema/meal');
const Recipe = require('./recipe');
const User = require('./user');
const MealPlan = require('./mealPlan');
const MealDay = require('./mealDay');
const Serving = require('./serving');

const createMultipleMeal = async (user_id, date, type, nutritions) => {
    const recipe = await Recipe.findRecipeWithNutritions(type, nutritions.calories, nutritions.protein, nutritions.carbs, nutritions.fat);
    if (recipe){
        const mealDetails = {type, user_id, day: date.toLocaleDateString(), recipe_id: recipe._id };
        const meal = new Meal(mealDetails);
        await meal.save();
        return recipe;
    }
}

const getRandomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

const dateAfterSomeDays = (startDate, numberOfDays) => {
    var targetDate = new Date();
    targetDate.setDate(startDate.getDate() + numberOfDays)
    return targetDate;
}
const getDays = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((endDate - startDate) / oneDay)); ;
}
const formatDate = (date) => {
    if (!date) return null;
    const formattedDate = new Date(date);
    
    return formattedDate;
}

schema.statics.generateMealPlan = async function(planFilter, user_id){
    const startDate = formatDate(planFilter.startDate) || dateAfterSomeDays(new Date(), 0);
    const endDate = formatDate(planFilter.endDate) || dateAfterSomeDays(new Date(), 1);
    const user = await User.findOne({_id: user_id});

    const numberOfDays = user.preferences.mealPlanDuration || getDays(startDate, endDate);

    const userPreferences = user.preferences;
    let mealNumberPerDay = 0;
    
    if (userPreferences  ){
        mealNumberPerDay = userPreferences.mealsPerDay || getRandomBetween(2, 4);
    }else{
        mealNumberPerDay = getRandomBetween(2, 4);
    }
    // const recipePerMeal = getRandomBetween(1, 2);
    const recipePerMeal = 1;
    const totalRecipes = numberOfDays * mealNumberPerDay * recipePerMeal;

    const recommendedRecipes = await user.recommendRecipes(totalRecipes);

    let plan = [];
    let mealPlan = new MealPlan();
    mealPlan.user = user._id;
    mealPlan.startDate = startDate;
    mealPlan.endDate = endDate;


    let recipeIndex = 0;
    // adjusting the days
    let currentMeal = 0;

    for(day = 0; day < numberOfDays; day++){
        currDate = dateAfterSomeDays(startDate, day);
        let meals = [];
        let mealDay = new MealDay();
        mealDay.mealPlan = mealPlan._id;
        mealDay.date = currDate;
        // adjusting the meals in the days
        for(mealIndex = 0; mealIndex < mealNumberPerDay; mealIndex++){
            let meal = new this.prototype.constructor();
            let servings = [];
            meal.name = `Meal ${++currentMeal}`; // what should be the the value of this?
            // adjusting the recipes in a meal
            for(recipe = 0; recipe < recipePerMeal; recipe++){
                let serving = new Serving();
                serving.measure = {
                    mag : 1,
                    unit: "porsion"
                };
                const recipeForServing = recommendedRecipes[recipeIndex++];
                serving.recipe = recipeForServing._id;
                await serving.save();
                servings.push(serving);
            }
            meal.servings = servings;
            await meal.save();
            meals.push(meal._id);
        }
        mealDay.meals = meals;
        await mealDay.save();
        plan.push(mealDay._id);
    }
    mealPlan.plan = plan;
    await mealPlan.save();
    return mealPlan;
}

const Meal = mongoose.model("Meal", schema);
module.exports = Meal;