const request = require('supertest');
const app = require('../src/app');
// const Recipe = require('../src/mongo/model/recipe');
const mongoose = require('mongoose');

const {test_user} = require('../src/_helpers/test_helpers');

let token = null;

beforeAll( async (done) => {
    const res = await request(app)
        .post('/users/login')
        .send({
            email: test_user.email,
            password: test_user.password,
        });
    token = 'Bearer ' + res.body.token;
    done();
});

afterAll(async () => {
    mongoose.disconnect();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});

test('Should get recipe', async (done) => {
    const res = await request(app)
        .post('/recipe/nameFilter')
        .set('Authorization', token) //set header for this test
        .send({
            recipe_name: "Fabulous Fruit Salad"
        });
    expect(res.statusCode).toEqual(201);
    done();
});