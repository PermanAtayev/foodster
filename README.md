# foodster

## Development

To run a docker instance of mongodb in a local machine go [here](https://www.code4it.dev/blog/run-mongodb-on-docker).

## Documentation

### Deployment

The server is published [here](https://foodster-cs491.herokuapp.com/), please query that base url with parameters you want depending on the functionality.

For now in the `master` branch of this repository auto-deployment is configured. Therefore, it is important that nothing
that is unstable should be pushed to the `master`. The default branch of development called `development`.

### Documenting code

Documentation of swagger that is used to write documentation can be found [here](https://swagger.io/docs/specification/basic-structure/)

To make the generation of documentation an npm library swagger-autogen is used, you can
read further about it [here](https://github.com/davibaltar/swagger-autogen)

Once the comments for the swagger autogen are written,

```
npm run autogen
```

needs to be run. Once that is done swagger_output.json will be filled with the documentation
you have added. Then, you can go to the `base_url/docs` link to find the documentation.

### Testing

We are using Jest for a testing framework and Supertest for end-point testing purposes.
We have our tests under `__tests_` file which is recognized by jest. We group similar tests under seperate files like "recipe_router.test.js". This file consists of tests that are related to router of recipe which contains our endpoint related to recipe. Test file format is "name_of_test_file.test.js".

In this file, we have beforeAll and afterAll functions. beforeAll is executed before starting the tests in this file and afterAll is executed after the tests are done. Also, in afterAll function, we have this code piece due to close the opened connections after the tests are done:

```
mongoose.disconnect();
await new Promise(resolve => setTimeout(() => resolve(), 500));
```

You can also use beforeEach and afterEach functions if you have some specific things you need to consider before testing each unit test.

In the test files, besides these functions, you also have your unit tests. the format you need to follow for your tests:

```
test('Name your test', async (done) => {
    // run your functionality
    // write your assertions
    done();
});

```

example test:

```
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

```

when you want to start testing, you need to run the following command:

```
npm run test
```

### Environment variables:

```
NODE_ENV=development
PORT=8077
CONNECTION_STRING=YOUR CLOUD TEST MONGODB URI
CONNECTION_STRING_DEV=YOUR LOCAL MONGODB URI
CONNECTION_STRING_TEST=YOUR CLOUD TEST ENVIRONMENT MONGODB URI
CONNECTION_STRING_DEPLOYMENT=YOUR CLOUD DEVELOPMENT MONGODB URI
JWT_SECRET=FOODSTER_SECRET
```
