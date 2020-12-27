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
needs to be sent where ```email``` and ```password``` fields of the request are required. If your request is successful, response with stat 201 will be sent back.

To login a user request
```
POST /users/login
```
needs to be sent where ```email``` and ```password``` fields of the request are required. If your request is successful, response with status 200 will be sent back, as well as the token you will need to use in your subsequent requests. To add the token to your header, make sure that is in the Authorization header with value: 
```Bearer <token_value>```. For example, if your token is equal to a.b.c, then your request would have an Authorization header with value ```Bearer a.b.c```.

To save and / or update metadata related to the user request
```
POST /users/updateinfo
```
authentication is required for this update, in the body of the request have all the fields that need to be updated / saved.




### Meal related queries
To get a meal for an authorized user request
```
GET /meals/generateRandom
```

