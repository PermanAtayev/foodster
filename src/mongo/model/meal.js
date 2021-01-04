const mongoose = require('mongoose');
const schema = require('../schema/meal');
const Recipe = require('./recipe');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');

const createMultipleMeal = async (user_id, date, type, nutritions) => {
    
    const recipe = await Recipe.findRecipeWithNutritions(type, nutritions.calories, nutritions.protein, nutritions.carbs, nutritions.fat);
    if (recipe){
        const mealDetails = {type, user_id, day: date.toLocaleDateString(), recipe_id: recipe._id };
        const meal = new Meal(mealDetails);
        await meal.save();
        return recipe;
    }
}

schema.statics.generateMealPlan = async function(planFilter, user_id){
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