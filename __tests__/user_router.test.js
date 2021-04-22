const app = require('../src/app');
const mongoose = require('mongoose');
const {test_user, test_recipe} = require('../src/_helpers/test_helpers');
const User = require('./../src/mongo/model/User');
const Recipe = require('../src/mongo/model/recipe');
const supertest = require('supertest');
const { TokenExpiredError } = require('jsonwebtoken');
const { restart } = require('nodemon');
const request = supertest(app);

let token = null;
beforeAll(async(done) => {
    if (mongoose.connection.readyState !== 1){
        await mongoose.connect(process.env.CONNECTION_STRING_TEST,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        done();
    }
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
    //console.log("user state :" + mongoose.connection.readyState);
    done();
});



test('Should login', async (done) => {
    const res = await request
        .post('/users/login')
        .send({
            email: test_user.email,
            password: test_user.password,
        });
    expect(res.statusCode).toEqual(200);
    done();
});

test('Should update information of user', async (done) => {
    const res2 = await request
        .patch('/users')
        .set('Authorization', token)
        .send({
            age: 25,
            gender: "Helicopter"
        });
    const user = await User.findOne({email: test_user.email});
    const userAge = user.age;
    const userGender = user.gender;
    if (user){
        user.age = 18;
        user.gender = "TestDocument";
        await user.save();
    }
    expect(user).toEqual(expect.anything());
    expect(userAge).toEqual(25);
    expect(userGender).toEqual("Helicopter");
    expect(res2.statusCode).toEqual(201);
    done();
});

test('Should find the liked recipes', async (done) => {
    const res = await request
        .get('/users/liked_recipes') // 
        .set('Authorization', token);

    const user = await User.findOne({email: test_user.email});
    const populatedUser = await user.populate("likedRecipes", "name").execPopulate();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(populatedUser.likedRecipes.length);
    expect(JSON.stringify( res.body[0])).toStrictEqual(JSON.stringify( populatedUser.likedRecipes[0]));
    done();
});

