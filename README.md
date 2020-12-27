# foodster

## Development

To run a docker instance of mongodb in a local machine go [here](https://www.code4it.dev/blog/run-mongodb-on-docker).

## Deployment

## Documentation

The server is published [here](https://foodster-cs491.herokuapp.com/), please query that base url with parameters you want depending on the functionality.

### User related queries

To sign-up a user request

```
POST /users/signup
```

needs to be sent where `email` and `password` fields of the request are required. If your request is successful, response with stat 201 will be sent back.

To login a user request

```
POST /users/login
```

needs to be sent where `email` and `password` fields of the request are required. If your request is successful, response with status 200 will be sent back, as well as the token you will need to use in your subsequent requests. To add the token to your header, make sure that is in the Authorization header with value:
`Bearer <token_value>`. For example, if your token is equal to a.b.c, then your request would have an Authorization header with value `Bearer a.b.c`.

### Meal related queries

To get a meal for an authorized user request

```
GET /meals/generate
```

needs to be sent where `breakfast_number`, `lunch_number`, `dinner_number`, `snack_number`, `calories`, `protein`, `carbs` and `fat` fields of the request are required.
Example body:

```
{
    "breakfast_number": 3,
    "lunch_number": 2,
    "dinner_number": 1,
    "snack_number": 3,
    "calories" : 243,
    "protein" : 5.8,
    "carbs": 37.4,
    "fat": 9.8
}
```

meal plan data is returned in the json format. plan is divided days and days are divided into meals. days may have specific meal (breakfast, lunch, dinner or snack) or not. So, some days may have breakfast, dinner, and some days may have only breakfast.
