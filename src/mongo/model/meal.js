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
    // targetDate.setHours(0);
    // targetDate.setMinutes(0);
    // targetDate.setSeconds(0);
    // targetDate.setMilliseconds(0);
    return targetDate;
}
const getDays = (startDate, endDate) => {
    return (endDate.getDate() - startDate.getDate()) + 1 ;
}
const formatDate = (date) => {
    if (!date) return null;
    const formattedDate = new Date(date);
    
    return formattedDate;
}

schema.statics.generateMealPlan = async function(planFilter, user_id){
    const startDate = formatDate(planFilter.startDate) || dateAfterSomeDays(new Date(), 0);
    const endDate = formatDate(planFilter.endDate) || dateAfterSomeDays(new Date(), 1);
    const numberOfDays = getDays(startDate, endDate);
    const user = await User.findOne({_id: user_id});
    const userPreferences = user.preferences;
    let mealNumberPerDay = 0;
    
    if (userPreferences  ){
        mealNumberPerDay = userPreferences.mealsPerDay || getRandomBetween(2, 4);
    }else{
        mealNumberPerDay = getRandomBetween(2, 4);
    }
    const recipePerMeal = getRandomBetween(1, 2);
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
                //console.log("day: " + day+", meal: "+mealIndex + ", recipe : " + recommendedRecipes[recipeIndex] );
                const recipeForServing = await Recipe.findOne({name: recommendedRecipes[recipeIndex++]});
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

schema.statics.generateMealPlanOld = async function(planFilter, user_id){
    try{
        let mealPlan = [];

        let maxMealType = Math.max(planFilter.breakfast_number, planFilter.lunch_number, planFilter.dinner_number, planFilter.snack_number);

        let date = new Date();
        for(let i = 0; i < maxMealType; i++){
            let dailyPlan = {day: date.toLocaleDateString()};
            // breakfast
            if (planFilter.breakfast_number > 0){
                dailyPlan.breakfast = await createMultipleMeal(user_id, date, "breakfast", planFilter);
                planFilter.breakfast_number--;
            }

            //lunch
            if (planFilter.lunch_number > 0){
                dailyPlan.lunch =await createMultipleMeal(user_id, date, "lunch", planFilter);
                planFilter.lunch_number--;
            }

            //dinner
            if (planFilter.dinner_number > 0){
                dailyPlan.dinner =await createMultipleMeal(user_id, date, "main dish", planFilter);
                planFilter.dinner_number--;
            }

            //snack
            if (planFilter.snack_number > 0){
                dailyPlan.snack =await createMultipleMeal(user_id, date, "snack", planFilter);
                planFilter.snack_number--;
            }
            
            mealPlan.push(dailyPlan);
            date.setDate(date.getDate() + 1);
        }
        return mealPlan;
    }catch(e){
        throw new Error("Meal plan could not be generated! : " + e);
    }
}

const Meal = mongoose.model("Meal", schema);
module.exports = Meal;