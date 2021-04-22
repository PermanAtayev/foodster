
const app = require('../src/app');
const mongoose = require('mongoose');
const Recipe = require('./../src/mongo/model/Recipe');
const User = require('./../src/mongo/model/User');

const {test_user, test_recipe, test_recipe2} = require('../src/_helpers/test_helpers');
const { TokenExpiredError } = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);

let token = null;
beforeAll(async(done) => {
    if (mongoose.connection.readyState !== 1){
        await mongoose.connect(process.env.CONNECTION_STRING_TEST,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    }
    done();
});
beforeEach(async(done) => {
    const res = await request
            .post('/users/login')
            .send({
                email: test_user.email,
                password: test_user.password,
            });
    token = 'Bearer ' + res.body.token;
    done();
});

afterAll(async(done) => {
    await mongoose.disconnect();
    done();
});


test('Should get recipe', async (done) => {
    await request
        .post('/recipes')
        .set('Authorization', token)
        .send(test_recipe);

    const res2 = await request
        .get('/recipes/' + test_recipe.name)
        .set('Authorization', token);

    const recipe = await Recipe.findOne({name: test_recipe.name});
    const recipeId = recipe._id;
    await recipe.delete();
    expect(recipeId).toEqual(expect.anything());
    expect(res2.statusCode).toEqual(200);
    done();
});

test('Should add recipe', async (done) => {
    const res2 = await request
        .post('/recipes')
        .set('Authorization', token) //set header for this test
        .send(test_recipe2);

    const recipe = await Recipe.findOne({name: test_recipe2.name});
    const recipeName = recipe.name;
    expect(recipe).toEqual(expect.anything());
    await Recipe.deleteOne({name: test_recipe2.name});
    expect(res2.statusCode).toEqual(201);
    expect(recipeName).toEqual(test_recipe2.name);
    done();
});

test('Should like the recipe', async (done) => {
    const res = await request
        .post('/recipes')
        .set('Authorization', token)
        .send(test_recipe);
    

    const res2 = await request
        .post('/recipes/like/'+test_recipe.name)
        .set('Authorization', token);
    
    const user = await User.findOne({email: test_user.email});
    const recipe = await Recipe.findOne({name: test_recipe.name});
    const likedRecipes = user.likedRecipes;
    const recipeId = recipe._id + "";
    const recipeIncluded = likedRecipes.includes(recipeId);
    const index = user.likedRecipes.indexOf(recipe._id);
    if (index > -1) {
        await user.likedRecipes.splice(index, 1);
    }
    await Recipe.deleteOne({name: recipe.name});
    await user.save();
    expect(index).not.toBe(-1);
    expect(recipeIncluded).toEqual(true);
    expect(res.statusCode).toEqual(201);
    expect(res2.statusCode).toEqual(200);
    expect(user).toEqual(expect.anything());
    expect(recipe).toEqual(expect.anything());
    
    done();
});