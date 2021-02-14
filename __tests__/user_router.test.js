const request = require('supertest');
const app = require('../src/app');
const User = require('../src/mongo/model/user');
const mongoose = require('mongoose');
const {test_user} = require('../src/_helpers/test_helpers');


afterAll(async () => {
    mongoose.disconnect();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
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
})
