const express = require('express');
const router = express.Router();
const User = require('../mongo/model/user');
const Recipe = require('../mongo/model/recipe')
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const cache = require('../middleware/cache')
const constants = require("../data/constants");


router.post('/users/signup', async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint for a user to signup'
    */

    /*
        #swagger.parameters['email'] = {
            in: 'body',
            description: 'User email',
            required: true,
            type: 'string',
            schema: {
                example: 'antonio@gmail.com'
            }
         }
    */

    /*
        #swagger.parameters['password'] = {
            in: 'body',
            description: 'User password',
            required: true,
            type: 'string',
            schema: {
                example: 'password'
            }
        }
    */

    /*
        #swagger.responses[201] = {
            schema: {
                "id" : 1234,
                "token": "token_string"
            }
        }
    */

    const user = new User(req.body);
    try {
        await user.save();
        await user.generateAuthToken();

        return res.status(201).send({
            id: user._id,
            token: user.token
        });
    } catch (e) {
        res.status(406).send(e + "");
    }
});

router.post('/users/login', async (req, res) => {
    /*    #swagger.tags = ['User']
          #swagger.description = 'Endpoint for a user to login. Will get a token back if successful.'
    */

    /*
    #swagger.parameters['email'] = {
        in: 'body',
        description: 'User email',
        required: true,
        type: 'string',
        schema: {
            example: 'antonio@gmail.com'
        }
        }
    */

    /*
    #swagger.parameters['password'] = {
    in: 'body',
    description: 'User password',
    required: true,
    type: 'string',
    schema: {
        example: 'password'
    }
    }
    */


    /*
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

router.post('/users/updateinfo', auth, async (req, res) => {
    /*
          #swagger.tags = ['User']
          #swagger.description = 'Endpoint to update the user info'
    */
    const updates = Object.keys(req.body);

    try {
        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        await user.save();
        return res.status(201).send(user);
    } catch (error) {
        return res.status(400).send(error);
    }
})

// TODO needs to be documented
router.post('/users/likeRecipe', auth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Endpoint for a user to like a recipe'
*/
    /*
        #swagger.parameters['recipeName'] = {
            in: 'body',
            description: 'Name of the recipe to be liked',
            required: true,
            type: 'string',
            schema: {
                example: 'Pasta with mozarella cheese'
            }
         }
        #swagger.responses[200] = {
            schema: {
                "text": "The meal is liked successfully"
            }
        }
        #swagger.responses[404] = {
            schema: {
                "text": "Recipe does not exist"
            }
        }
        #swagger.responses[400] = {
            schema: {
                "text": "The meal is already liked"
            }
        }

*/


    try {
        const user = req.user;
        let mealIsAlreadyLiked = false;
        const recipeName = req.body.recipeName;

        const recipe = await Recipe.findByName(recipeName);

        if (!recipe) {
            return res.status(404).send("Recipe does not exist");
        }

        if (user.likedRecipes !== null) {
            if (user.likedRecipes.includes(recipe._id)) {
                mealIsAlreadyLiked = true;
            }
        }
        if (!mealIsAlreadyLiked) {
            user.likedRecipes.push(recipe._id);
            await user.save();

            recipe.numberOfLikes = recipe.numberOfLikes + 1;
            // recipe.likedUsers.append(user._id);
            await recipe.save();

            return res.status(200).send("The meal is liked successfully");
        } else {
            return res.status(400).send("The meal is already liked");
        }
    } catch (error) {
        return res.status(400).send(error);
    }
})

// TODO needs to tested
// TODO needs to be documented
router.get('/users/myLikedRecipes', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    let user = req.user;
    try {
        // only return the name field of the liked recipes
        const populatedUser = await user.populate("likedRecipes", "name").execPopulate();
        return res.status(200).send(populatedUser.likedRecipes);
    } catch (e) {
        return res.status(404).send("Recipes were not found. " + e);
    }
})

// TODO test
// TODO document
router.get('/users/myLikedIngredientFrequencies', auth, cache(constants.CACHEPERIOD), async (req, res) => {
    let user = req.user;
    const result = await user.getIngredientFrequencyOfLikedMeals();
    res.status(200).send(result);
})


router.get('/users/list', auth, permission('userList'),
    /*    #swagger.tags = ['User']
      #swagger.description = 'Endpoint to get a list of users, requires authentication.'
    */
    async (req, res) => {
        try {
            const users = await User.find({});
            console.log(users);
            return res.status(200).send(users);
        } catch (e) {
            res.status(404).send(e + "");
        }
    })

router.delete('/users/deleteAll', auth, permission('deleteAllUsers'),
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to delete all users'
    */

    async (req, res) => {
        try {
            await User.deleteMany({});
            res.send("Successfully delete all users");
        } catch (e) {
            res.status(500).send(e + "");
        }
    })


module.exports = router;