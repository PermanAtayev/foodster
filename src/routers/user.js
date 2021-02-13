const express = require('express');
const router = express.Router();
const User = require('../mongo/model/user');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');

router.post('/users/signup', async (req, res) =>{
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
    try{
        await user.save();
        await user.generateAuthToken();

        return res.status(201).send({
            id: user._id,
            token: user.token
        });
    }
    catch (e){
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
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        await user.generateAuthToken();
        res.status(200).send(
            {
                token: user.token
            });
    }
    catch(e){
        res.status(400).send(e + "");
    }
});

router.patch('/users/updateinfo', auth, async(req, res) => {
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
    }
    catch(error){
        res.status(400).send(error);
    }
})

router.get('/users/list', auth, permission('userList'),
    /*    #swagger.tags = ['User']
      #swagger.description = 'Endpoint to get a list of users, requires authentication.'
    */
    async (req, res) => {
    try{
        const users = await User.find({});
        console.log(users);
        return res.status(200).send(users);
    }
    catch(e){
        res.status(404).send(e + "");
    }
})

router.delete('/users/deleteAll',  auth, permission('deleteAllUsers'),
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to delete all users'
    */

    async(req, res) => {
    try{
        await User.deleteMany({});
        res.send("Successfully delete all users");
    }
    catch(e){
        res.status(500).send(e + "");
    }
})


module.exports = router;