const express = require('express');
const router = express.Router();
const User = require('../mongo/model/user');
const auth = require('../middleware/auth');
const EmailToken = require('../mongo/model/emailToken');
const cache = require('../middleware/cache')
const constants = require("../data/constants");

router.post('/users/signup', async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint for a user to signup'
        #swagger.parameters['email'] = {
            in: 'body',
            description: 'User email',
            required: true,
            type: 'string',
            schema: {
                example: 'antonio@gmail.com'
            }
         }
        #swagger.parameters['password'] = {
            in: 'body',
            description: 'User password',
            required: true,
            type: 'string',
            schema: {
                example: 'password'
            }
        }
        #swagger.responses[201] = {
            schema: {
                "id" : 1234,
                "token": "token_string"
            }
        }
    */
    try {
        const user = new User(req.body);
        await user.save();
        await user.generateAuthToken();
        user.sendEmailVerification(req);

        return res.status(201).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification email, use "resend" endpoint. Check API documentation for endpoint details.');
    } catch (e) {
        res.status(406).send(e + "");
    }
});

router.get('/users/confirmation/:email/:token', async(req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint for a user to signup'
        #swagger.parameters['email'] = {
            in: 'path',
            description: 'User email',
            required: true,
            type: 'string',
            schema: {
                example: 'antonio@gmail.com'
            }
         }
        #swagger.parameters['token'] = {
            in: 'path',
            description: 'Verification token',
            required: true,
            type: 'string',
            schema: {
                example: 'verification_token'
            }
        }
        #swagger.responses[200] = {
            schema: {
                "token": "User is verified."
            }
        }
        #swagger.responses[500] = {
            schema: {
                "text": "[Database error]"
            }
        }
        #swagger.responses[401] = {
            schema: {
                "text" : "We were unable to find a user for this verification. Please SignUp!"
            }
        }
        #swagger.responses[400] = {
            schema: {
                "text" : "Your verification link may have expired. Please use 'resend' endpoint to resend the verification link. Check API documentation for endpoint details."
            }
        }
    */
    EmailToken.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send('Your verification link may have expired. Please use "resend" endpoint to resend the verification link. Check API documentation for endpoint details.');
        }
        // if token is found then check valid user 
        else {
            User.findOne({_id: token._userId, email: req.params.email}, function (err, user) {
                if (err) {
                    return res.status(500).send(err.message);
                }
                // not valid user
                if (!user) {
                    return res.status(401).send('We were unable to find a user for this verification. Please SignUp!');
                }
                // user is already verified
                else if (user.isVerified) {
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else {
                    // change isVerified to true
                    user.isVerified = true;
                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send(err.message);
                        }
                        // account successfully verified
                        else {
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });
});


router.post('/users/confirmation/resend', async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint for a user to signup'
        #swagger.parameters['email'] = {
            in: 'body',
            description: 'User email',
            required: true,
            type: 'string',
            schema: {
                example: 'antonio@gmail.com'
            }
         }
        #swagger.responses[200] = {
            schema: {
                "text": "This account has been already verified. Please log in."
            }
        }
        #swagger.responses[201] = {
            schema: {
                "text": "A verification email has been sent to [user.email]. It will be expire after one day. If you not get verification email, use 'resend' endpoint. Check API documentation for endpoint details."
            }
        }
        #swagger.responses[400] = {
            schema: {
                "msg" : "We were unable to find a user with that email. Make sure your Email is correct!"
            }
        }
    */
    User.findOne({ email: req.body.email }, function (err, user) {
        // user is not found into database
        if (!user) {
            return res.status(400).send({msg: 'We were unable to find a user with that email. Make sure your Email is correct!'});
        }
        // user has been already verified
        else if (user.isVerified) {
            return res.status(200).send('This account has been already verified. Please log in.');

        }
        // send verification link
        else {
            // generate token and save
            user.sendEmailVerification(req);
            return res.status(201).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification email, use "resend" endpoint. Check API documentation for endpoint details.');
        }
    });
});

router.post('/users/login', async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Endpoint for a user to login. Will get a token back if successful.'
    #swagger.parameters['email'] = {
        in: 'body',
        description: 'User email',
        required: true,
        type: 'string',
        schema: {
            "email": "antonio@gmail.com"
        }
     }

    #swagger.parameters['password'] = {
        in: 'body',
        description: 'User password',
        required: true,
        type: 'string',
        schema: {
            "password": "example"
        }
    }

    #swagger.responses[200] = {
        schema: {
            "token": "token_string"
        }
    }

    #swagger.responses[400] = {
        description: 'Error: Unable to login'
    }
*/
    try {
        //console.log(req.body.email + ", " + req.body.password);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        await user.generateAuthToken();

        res.status(200).send(
            {
                token: user.token
            });
    } catch (e) {
        res.status(400).send(e + "");
    }
});

// TODO test
router.get('/users', auth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Endpoint to get available information related to the user'

    #swagger.responses[200] = {
        schema: {
            "allergies": [
                "pepper",
                "salt"
            ],
            "isVerified": true,
            "likedRecipes": [],
            "dislikedRecipes": [],
            "_id": "user_id1",
            "email": "example@gmail.com",
            "token": "token_string",
            "preferences": {
                "calRange": [
                    1,
                    10
                ],
                "protRange": [],
                "costRange": [],
                "dietType": [],
                "cookingTime": [],
                "restrictions": [],
                "_id": "preference_id",
                "mealsPerDay": 10,
                "difficulty": "ExtraHard"
            }
        }
    }

        #swagger.responses[401] = {
            schema: {
                "error": "Please authenticate"
            }
        }

     */
    try {
        const user = await User.findOne({_id: req.user._id});
        res.status(200).json(user);
    } catch (e) {
        res.status(400).send("Bad request");
    }
})
    


// TODO check how do we disallow updating the id of preferences object of user
router.patch('/users', auth, async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to update the user info that includes: username, age, gender, height, allergies, preferences'

        #swagger.parameters["username"] = {
            in: 'body',
            description: 'Users username',
            required: false,
            type: 'string',
            schema: {
                "username": "boss"
            }
        }

        #swagger.parameters["age"] = {
            in: 'body',
            description: 'User age',
            required: false,
            type: 'number',
            schema: {
                "age": 20
            }
        }

        #swagger.parameters["height"] = {
            in: 'body',
            description: 'User height in meters',
            required: false,
            type: 'number',
            schema: {
                "height": 1.85
            }
        }

        #swagger.parameters["allergies"] = {
            in: 'body',
            description: 'Users allergies. This value will overwrite the old allergies value of the user',
            required: false,
            type: 'array',
            items: {
                'type' : 'string'
            },
            schema: {
                "allergies": ["pepper", "salt"]
            }
        }

        #swagger.parameters["preferences"] = {
            in: 'body',
            description: 'Users preferences update in the signup or anytime afterwards. Following fields can be added / updated: calRange, protRange, costRange, dietType, \
            cookingTime, restrictions, mealsPerDay, difficulty',
            required: false,
            type: 'JSON object',
            schema: {
                "preferences" : {
                    "mealsPerDay" : 10,
                    "calRange" : [1, 10],
                    "difficulty" : "ExtraHard"
                }
            }
        }

        #swagger.parameters["gender"] = {
            in: 'body',
            description: 'Users gender which can be: male, female, other',
            required: false,
            type: 'string',
            schema: {
                "gender": "female"
            }
        }

        #swagger.responses[201] = {
            schema: {
                "allergies": [
                    "pepper",
                    "salt"
                ],
                "isVerified": true,
                "likedRecipes": [],
                "dislikedRecipes": [],
                "_id": "606db95f4aba966eccd85648",
                "email": "perman.atayev17@gmail.com",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDZkYjk1ZjRhYmE5NjZlY2NkODU2NDgiLCJpYXQiOjE2MTc4MDM2MTUsImV4cCI6MTYxNzgwNzIxNX0.9hbXeasTPBVvqhaz9AdYZBdZ4HR1vODjlx3ks7Y1nmU",
                "preferences": {
                    "calRange": [
                        1,
                        10
                    ],
                    "protRange": [],
                    "costRange": [],
                    "dietType": [],
                    "cookingTime": [],
                    "restrictions": [],
                    "_id": "606dbf8426bac5635c7bd255",
                    "mealsPerDay": 10,
                    "difficulty": "ExtraHard"
                }
            }
         }

         #swagger.responses[400] = {
            schema: {
                "text": "Error: Field email is not allowed to be updated or does not exist"
            }
         }
    */
    const updates = Object.keys(req.body);

    const fieldsAllowedToBeUpdated = ["allergies", "username", "age", "gender", "height", "preferences", "weight"];

    try {
        const user = req.user;
        // check whether all updates are allowed.
        updates.forEach((update) => {
            if (!fieldsAllowedToBeUpdated.includes(update)) {
                throw(new Error(`Field ${update} is not allowed to be updated or does not exist`));
            }
        })

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        return res.status(201).send(user);

    } catch (error) {
        return res.status(400).send(error + "");
    }
})

// TODO needs to tested
router.get('/users/liked_recipes', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'List the recipe that user liked'
        #swagger.responses[200] = {
            schema:  [
                        {
                            "name": "recipe_name1"
                        }
                    ]
            
        }
        #swagger.responses[404] = {
            schema: {
                "text": "Recipes were not found + [error]"
            }
        }

    */
    let user = req.user;
    try {
        // only return the name field of the liked recipes
        //console.log(user.likedRecipes)
        const populatedUser = await user.populate("likedRecipes").execPopulate();
        return res.status(200).send(populatedUser.likedRecipes);
    } catch (e) {
        return res.status(404).send("Recipes were not found. " + e);
    }
})

router.get('/users/liked_ingredient_frequencies', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint for a user to list the ingredient frequency of liked meals'
        #swagger.responses[200] = {
            schema: {
                    "ingredient1": 5,
                    "ingredient2": 2,
                    "ingredient3": 1
            }
        }
        #swagger.responses[404] = {
            schema: {
                "text": "Database error + [error]"
            }
        }

    */
    let user = req.user;
    try {
        const result = await user.getIngredientFrequencyOfLikedMeals();
        res.status(200).send(result);
    }catch (e) {
        return res.status(404).send("Database error " + e);
    }
})

module.exports = router;