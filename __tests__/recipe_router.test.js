const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Recipe = require('./../src/mongo/model/Recipe');


const {test_user, test_recipe, test_recipe2} = require('../src/_helpers/test_helpers');

let token = null;

beforeEach(async(done) => {
    if (mongoose.connection.readyState !== 1){
        await mongoose.connect(process.env.CONNECTION_STRING_TEST,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        const res = await request(app)
                .post('/users/login')
                .send({
                    email: test_user.email,
                    password: test_user.password,
                });
        token = 'Bearer ' + res.body.token;
        
        done();
    }
});
afterEach(async(done) => {
    await mongoose.connection.close();
    done();
});


test('Should get recipe', async (done) => {
    const res = await request(app)
        .post('/recipes/addRecipe')
        .set('Authorization', token) //set header for this test
        .send(test_recipe);
    const res2 = await request(app)
        .post('/recipes/nameFilter')
        .set('Authorization', token) //set header for this test
        .send({
            recipe_name: test_recipe.name
        });
    const recipe = await Recipe.findOne({name: test_recipe.name});
    await recipe.delete();
    expect(res2.statusCode).toEqual(201);
    done();
});

test('Should add recipe', async (done) => {
    const res2 = await request(app)
        .post('/recipes/addRecipe')
        .set('Authorization', token) //set header for this test
        .send(test_recipe2);
    const recipe = await Recipe.findOne({name: test_recipe2.name});
    if (recipe)
        await Recipe.deleteOne({name: test_recipe2.name});
    const recipeName = recipe.name;
    expect(res2.statusCode).toEqual(201);
    expect(recipe).toEqual(expect.anything());
    expect(recipeName).toEqual(test_recipe2.name);
    done();
});