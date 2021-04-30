const mongoose = require('mongoose');
const schema = require('../schema/user');
const jwt = require("jsonwebtoken");
const EmailToken = require('./emailToken');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const sgMail = require('@sendgrid/mail');
const Ingredient = require("./ingredient");
const Heap = require("heap");
const Recipe = require("./recipe");
const MealPlan = require('./mealPlan');

schema.methods.toJSON = function () {
    let user = this.toObject()
    delete user.permissions
    delete user.__v
    delete user.password
    delete user._id
    return user
}

schema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1h'});

    if (!user.token)
        user.token = token;

    // if the token of the user has expired, the token needs to be updated
    try {
        jwt.verify(user.token, process.env.JWT_SECRET);
    } catch (e) {
        user.token = token;
    }
    await user.save();
    return token;

}

schema.methods.sendEmailVerification = async function (req) {
    // generate token and save
    const user = this;

    var emailToken = new EmailToken({_userId: user._id, token: cryptoRandomString({length: 24}).toString('hex')});
    emailToken.save(function (err) {
        if (err) {
            throw new Error(err.message);
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: user.email, // Change to your recipient
            from: process.env.SENDGRID_SENDER, // Change to your verified sender
            subject: 'Foodster Email Verification',
            text: 'Hello ' + user.email + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n',
            html: 'Hello ' + user.email + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n',
        }

        sgMail
            .send(msg)
            .catch((error) => {
                console.error(error)
            })
    });
}
schema.methods.hasPermission = async function (permission) {
    const user = this;
    let hasPermission = false;

    user.permissions.forEach(userPermission => {
        if (userPermission === permission) {
            hasPermission = true;
        }
    });
    return hasPermission;
}

schema.methods.willKillMe = function (recipe) {
    const user = this;
    const allergies = user.allergies;

    if (allergies) {
        for (let j = 0; j < allergies.length; j++) {
            allergicIngredientName = allergies[j].toLowerCase();
            for (let i = 0; i < recipe.ingredients.length; i++) {
                ingredientDescription = recipe.ingredients[i].description.toLowerCase();
                if (ingredientDescription.includes(allergicIngredientName)) {
                    return true;
                }
            }
        }
    }
    return false;
}


schema.methods.getIngredientFrequencyOfLikedMeals = async function () {
    const user = this;
    await user.populate("likedRecipes", "name ingredients").execPopulate();
    await user.populate("likedRecipes.ingredients.ingredient").execPopulate();
    const allergies = user.allergies;

    const likedRecipes = user.likedRecipes;
    let ingredientFrequencyCounter = {};

    const mainstreamIngredients = ["salt", "sugar", "water", "butter", "garlic", "black pepper", "oil"];

    likedRecipes.forEach((recipe) => {
        let edibles = recipe.ingredients;
        edibles.forEach((edible) => {
            const ingredient = edible.ingredient;
            let skipIngredient = false;

            for (let i = 0; i < mainstreamIngredients.length; i++) {
                if (edible.description.includes(mainstreamIngredients[i])) {
                    skipIngredient = true;
                    break;
                }
            }

            if (allergies && !skipIngredient) {
                for (let j = 0; j < allergies.length && !skipIngredient; j++) {
                    allergicIngredientName = allergies[j].toLowerCase();
                    ingredientDescription = edible.description.toLowerCase();
                    if (ingredientDescription.includes(allergicIngredientName)) {
                        skipIngredient = true;
                    }
                }
            }


            if (!skipIngredient) {
                if (ingredientFrequencyCounter[ingredient.name]) {
                    ingredientFrequencyCounter[ingredient.name].score += 1;
                } else {
                    ingredientFrequencyCounter[ingredient.name] = {ingredient, score: 1};
                }
            }
        })
    });

    return ingredientFrequencyCounter;
}


function min(a, b) {
    return (a < b ? a : b);
}

function inRange(range, number) {
    if (!range) {
        return false;
    }

    let left = range[0];
    let right = range[1];
    return (left <= number && number <= right);
}

schema.methods.getMealPlan = async function () {
    const user = this;
    const mealPlan = await MealPlan.find({user: user._id}).sort([['startDate', -1]]).limit(1);
    if (mealPlan) return mealPlan[0];
    else return null;
}

// TODO need to timestamp these recommendations so that we don't generate them from scratch every time
schema.methods.recommendRecipes = async function (limit) {
    const user = this;
    const ingredientFrequencyCounter = await this.getIngredientFrequencyOfLikedMeals();
    const ingredientInfo = Object.values(ingredientFrequencyCounter);
    let recipeScores = {};
    let recipesFound = 0;
    let n = min(limit, Object.keys(recipeScores).length);

    let similarRecipes = new Set();


    for (let i = 0; i < ingredientInfo.length && recipesFound < 4 * n; i++) {
        const ingredient = ingredientInfo[i].ingredient;

        if (ingredient) {
            const populatedIngredient = await ingredient.populate("inRecipes").execPopulate();
            await populatedIngredient.populate("inRecipes.ingredients.ingredient", "name").execPopulate();

            populatedIngredient.inRecipes.forEach((recipe) => {
                const score = ingredientFrequencyCounter[ingredient.name].score;
                if (recipeScores[recipe.name]) {
                    recipeScores[recipe.name] += score;
                } else if (recipesFound < 4 * n) {
                    similarRecipes.add(recipe);
                    recipeScores[recipe.name] = score;
                    recipesFound += 1
                }
            })
        }
    }

    // scoring of preferences
    for (let recipe of similarRecipes) {
        if (user.preferences) {
            if (recipe.nutrition) {
                if (inRange(user.preferences.calRange, recipe.nutrition.calories.mag))
                    recipeScores[recipe.name] += 4;

                if (inRange(user.preferences.protRange, recipe.nutrition.proteins.mag))
                    recipeScores[recipe.name] += 4;

                if (inRange(user.preferences.fatRange, recipe.nutrition.fats.mag))
                    recipeScores[recipe.name] += 4;

                if (inRange(user.preferences.carbRange, recipe.nutrition.carbs.mag))
                    recipeScores[recipe.name] += 4;
            }

            // needs to be tested
            if (recipe.estimatedPrice && inRange(user.preferences.costRange, recipe.estimatedPrice)) {
                recipeScores[recipe.name] += 4;
            }

            if (recipe.compatibleDiet && user.preferences.dietType && recipe.compatibleDiet.includes(user.preferences.dietType)) {
                recipeScores[recipe.name] += 5;
            }
        }
    }

    // initialise the min heap
    let heap = new Heap(function (a, b) {
        return a.score - b.score;
    });


    for (recipe of similarRecipes) {
        if (heap.size() < n && recipe) {
            heap.push({recipe, score: recipeScores[recipe.name]});
        } else if (heap.size() != 0) {
            let front = heap.peek();

            if (front.score < recipeScores[recipe.name]) {
                heap.pop();
                heap.push({recipe, score: recipeScores[recipe.name]});
            }
        }
    }


    let result = [];

    while (heap.size() > 0) {
        let top = heap.pop();
        result.push(top.recipe);
    }

    if (result.length === 0) {
        const kTopRecipesNumber = limit;
        const availableRecipes = await Recipe.countDocuments({});
        const returnNumberOfRecipes = min(availableRecipes, kTopRecipesNumber);
        const topRecipes = await Recipe.find({}).sort({numberOfLikes: -1});
        result = topRecipes.slice(0, returnNumberOfRecipes);
    }

    return result.reverse();
}


schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login, Password is wrong");
    }
    if (!user.isVerified) {
        throw new Error("Unable to login, please verify the account");
    }
    return user;
}


schema.pre("save", async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

//before the user needs to be deleted
schema.pre("remove", async function (next) {
    const user = this;
    next();
});

const User = mongoose.model("User", schema);

module.exports = User;