const mongoose = require('mongoose');
const schema = require('../schema/user');
const jwt = require("jsonwebtoken");
const EmailToken = require('./emailToken');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const sgMail = require('@sendgrid/mail');
const Ingredient = require("./ingredient");
const Heap = require("heap");

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

schema.methods.willKillMe = async function (recipe) {
    const user = this;
    const allergies = user.allergies;

    if (allergies) {
        for (let j = 0; j < allergies.length; j++) {
            allergicIngredientName = allergies[j].toLowerCase();
            for (let i = 0; i < recipe.ingredients.length; i++) {
                ingredientDescription = recipe.ingredients[i].description.toLowerCase();
                if(ingredientDescription.includes(allergicIngredientName)){
                    return true;
                }
            }
        }
    }
    return false;
}


// TODO needs to be tested after the last refactoring of modeling
// TODO document
schema.methods.getIngredientFrequencyOfLikedMeals = async function () {
    const user = this;
    await user.populate("likedRecipes", "name ingredients").execPopulate();
    await user.populate("likedRecipes.ingredients.ingredient").execPopulate();

    const likedRecipes = user.likedRecipes;
    let ingredientFrequencyCounter = {};

    likedRecipes.forEach((recipe) => {

        let edibles = recipe.ingredients;
        edibles.forEach((edible) => {
            const ingredient = edible.ingredient;

            if (ingredientFrequencyCounter[ingredient.name]) {
                ingredientFrequencyCounter[ingredient.name] += 1;
            } else {
                ingredientFrequencyCounter[ingredient.name] = 1;
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

// TODO need to timestamp these recommendations so that we don't generate them from scratch every time
schema.methods.recommendRecipes = async function (limit) {
    const user = this;
    const ingredientFrequencyCounter = await this.getIngredientFrequencyOfLikedMeals();
    let recipeScores = {};
    const ingredientNames = Object.keys(ingredientFrequencyCounter);

    let similarRecipes = new Set();

    for (let i = 0; i < ingredientNames.length; i++) {
        const ingredientName = ingredientNames[i];
        const ingredient = await Ingredient.findByName(ingredientName);

        if (ingredient) {
            const populatedIngredient = await ingredient.populate("inRecipes").execPopulate();
            //let recipeIngredient = await populatedIngredient.inRecipes[0].ingredients[0];
            await populatedIngredient.populate("inRecipes.ingredients.ingredient", "name").execPopulate();
            //console.log(populatedIngredient.inRecipes[0].ingredients)
            populatedIngredient.inRecipes.forEach((recipe) => {
                const score = ingredientFrequencyCounter[ingredientName];
                if (recipeScores[recipe.name]) {
                    recipeScores[recipe.name] += score;
                } else {
                    similarRecipes.add(recipe);
                    recipeScores[recipe.name] = score;
                }
            })
        }
    }

    for (let similarRecipe of similarRecipes) {
        const willKillMe = await this.willKillMe(similarRecipe);
        if (willKillMe)
            recipeScores[similarRecipe.name] = -1000;
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

            if (recipe.compatibleDiet && user.preferences.dietType && recipe.compatibleDiet.includes(user.preferences.dietType)) {
                recipeScores[recipe.name] += 1000;
            }
        }
    }

    // initialise the min heap
    let heap = new Heap(function(a, b){
        return a.score - b.score;
    });

    let n = min(limit, Object.keys(recipeScores).length);

    for(recipe of similarRecipes){
        if(heap.size() < n){
            heap.push({recipe, score: recipeScores[recipe.name]});
        }
        else{
            let front = heap.peek();
            if(front[1] < recipeScores[recipe.name]){
                heap.pop();
                heap.push({recipe, score: recipeScores[i]});
            }
        }
    }

    let result = [];

    // console.log("Final list of recipes:\n");

    while(heap.size() > 0){
        let top = heap.pop();
        result.push(top.recipe);

        console.log(top.recipe.name, top.score);
    }

    return result;
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