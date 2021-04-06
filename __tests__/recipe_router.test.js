const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

const {test_user} = require('../src/_helpers/test_helpers');

let token = null;

beforeEach(async(done) => {
    if (mongoose.connection.readyState !== 1){
        await mongoose.connect(process.env.CONNECTION_STRING_TEST,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
        async() => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    email: test_user.email,
                    password: test_user.password,
                });
            token = 'Bearer ' + res.body.token;
            done();
        });
    }
});

afterEach((done) => {
    mongoose.connection.close(() => done());
});


test('Should get recipe', async (done) => {
    const res2 = await request(app)
        .post('/recipe/nameFilter')
        .set('Authorization', token) //set header for this test
        .send({
            recipe_name: "Fabulous Fruit Salad"
        });
    expect(res2.statusCode).toEqual(201);
    done();
});