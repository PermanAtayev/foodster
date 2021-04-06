const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const {test_user} = require('../src/_helpers/test_helpers');

beforeEach(async(done) => {
    if (mongoose.connection.readyState !== 1){
        await mongoose.connect(process.env.CONNECTION_STRING_TEST,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
        () => done());
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