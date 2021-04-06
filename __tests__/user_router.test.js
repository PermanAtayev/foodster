const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const {test_user, test_recipe} = require('../src/_helpers/test_helpers');
const User = require('./../src/mongo/model/User');
const Recipe = require('../src/mongo/model/recipe');

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

afterEach((done) => {
    mongoose.connection.close(() => done());
});


test('Should login', async (done) => {
    const res = await request(app)
        .post('/users/login')
        .send({
            email: test_user.email,
            password: test_user.password,
        });
    // Assert that the database was changed correctly
    //console.log(res.body);
    expect(res.statusCode).toEqual(200);
    done();
});

test('Should update information of user', async (done) => {
    const res2 = await request(app)
        .post('/users/updateInfo')
        .set('Authorization', token)
        .send({
            age: 25,
            gender: "Helicopter"
        });
    const user = await User.findOne({email: test_user.email});
    expect(user).toEqual(expect.anything());
    if (user){
        user.age = 18;
        user.gender = "TestDocument";
        await user.save();
    }
    expect(res2.statusCode).toEqual(201);
    done();
});

test('Should find the liked meals', async (done) => {
    const res = await request(app)
        .get('/users/myLikedRecipes')
        .set('Authorization', token)
        .send({
            email: test_user.email
        });
    
    expect(res.statusCode).toEqual(200);
    const user = await User.findOne({email: test_user.email});
    const populatedUser = await user.populate("likedRecipes", "name").execPopulate();
    expect(res.body.length).toEqual(populatedUser.likedRecipes.length);
    expect(JSON.stringify( res.body[0])).toStrictEqual(JSON.stringify( populatedUser.likedRecipes[0]));
    done();
});

test('Should like the meal', async (done) => {
    const res = await request(app)
        .post('/recipes/addRecipe')
        .set('Authorization', token) //set header for this test
        .send(test_recipe);
    expect(res.statusCode).toEqual(201);

    const res2 = await request(app)
        .post('/users/likeRecipe')
        .set('Authorization', token)
        .send({
            email: test_user.email,
            recipeName: test_recipe.name
        });
    expect(res2.statusCode).toEqual(200);
    const user = await User.findOne({email: test_user.email});
    const recipe = await Recipe.findOne({name: test_recipe.name});
    expect(user).toEqual(expect.anything());
    expect(recipe).toEqual(expect.anything());
    if (user && recipe){
        expect(user.likedRecipes.includes(recipe._id)).toEqual(true);
        const index = user.likedRecipes.indexOf(recipe._id);
        if (index > -1) {
            await user.likedRecipes.splice(index, 1);
        }
        await user.save();
    }
    if (recipe) await Recipe.deleteOne({name: recipe.name});
    done();
});