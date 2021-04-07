const mongoose = require('mongoose');
const schema = require('../schema/user');
const jwt = require("jsonwebtoken");
const EmailToken = require('./emailToken');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const sgMail = require('@sendgrid/mail');
const Ingredient = require("./ingredient");

// TODO test this thoroughly, so that problems in other fields do not occur.
// The fields that are deleted here will be hidden when the user model is returned back
schema.methods.toJSON = function() {
    let user = this.toObject()
    delete user.permissions
    delete user.__v
    delete user.password
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
    
    var emailToken = new EmailToken({ _userId: user._id, token: cryptoRandomString({length: 24}).toString('hex') });
    emailToken.save(function (err) {
        if(err){
            throw new Error(err.message);
        }
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
        to: user.email, // Change to your recipient
        from: process.env.SENDGRID_SENDER, // Change to your verified sender
        subject: 'Foodster Email Verification',
        text: 'Hello '+ user.email +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n',
        html: 'Hello '+ user.email +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n',
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

// here we check whether ingredients of the recipe are among users allergies or not
// TODO needs to be tested
schema.methods.willKillMe = async function (recipe) {
    const user = this;
    let isAllergic = false;

    if (user.allergies !== null) {
        user.allergies.forEach((allergyName) => {
            recipe.ingredients.forEach((ingredient) => {
                if (ingredient.name === allergyName)
                    isAllergic = true;
            })
        })
    }
    return isAllergic;
}

// TODO needs to be tested
// TODO document
schema.methods.getIngredientFrequencyOfLikedMeals = async function(){
    const user = this;
    const populatedUser = await user.populate("likedRecipes", "name, ingredients").execPopulate();
    const likedRecipes = populatedUser.likedRecipes;
    let ingredientFrequencyCounter = {};

    likedRecipes.forEach((recipe) => {
        let ingredients = recipe.ingredients;

        ingredients.forEach((ingredient) => {
            if(ingredientFrequencyCounter[ingredient.name]){
                ingredientFrequencyCounter[ingredient.name] += 1;
            }
            else{
                ingredientFrequencyCounter[ingredient.name] = 1;
            }
        })
    });

    return ingredientFrequencyCounter;
}


function min(a, b) {
    return (a < b ? a : b);
}

// TODO Needs to be implemented
// TODO needs to be tested
// TODO document
// TODO need to timestamp these recommendations so that we don't generate them from scratch every time
schema.methods.recommendRecipes = async function(limit){
    const ingredientFrequencyCounter = await this.getIngredientFrequencyOfLikedMeals();
    let recipeScores = {};
    const ingredientNames = Object.keys(ingredientFrequencyCounter);

    let similarRecipes = new Set();

    for(let i = 0; i < ingredientNames.length; i++){
        const ingredientName = ingredientNames[i];
        const ingredient = await Ingredient.findByName(ingredientName);

        if(ingredient) {
            const populatedIngredient = await ingredient.populate("inRecipes", "name ingredients.name").execPopulate();

            populatedIngredient.inRecipes.forEach((recipe) => {
                const score = ingredientFrequencyCounter[ingredientName];
                if(recipeScores[recipe.name]){
                    recipeScores[recipe.name] += score;
                }
                else{
                    recipeScores[recipe.name] = score;
                }
                similarRecipes.add(recipe);
            })
        }
    }

    //    remove the similarRecipes that have allergetic ingredients
    for(let similarRecipe of similarRecipes){
        const willKillMe = await this.willKillMe(similarRecipe);

        if(willKillMe === true)
            delete recipeScores[similarRecipe.name];
    }

    recipeScores = Object.entries(recipeScores).sort((a, b) => b[1] - a[1]);

    let result = [];

    for(let i = 0; i < min(limit, Object.keys(recipeScores).length); i++)
        result.push(recipeScores[i][0]);

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
    if (!user.isVerified){
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