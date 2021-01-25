const express = require('express');
const router = express.Router();
const User = require('../mongo/model/user');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');

router.post('/users/signup', async (req, res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        await user.generateAuthToken();
        return res.status(201).send(user);
    }
    catch (e){
        res.status(406).send(e + "");
    }
});

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        await user.generateAuthToken();
        res.send(user);
    }
    catch(e){
        res.status(400).send(e + "");
    }
});

router.patch('/users/updateinfo', auth, async(req, res) => {
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

router.get('/users/list', auth, permission('userList'), async (req, res) => {
    try{
        const users = await User.find({});
        console.log(users);
        return res.status(200).send(users);
    }
    catch(e){
        res.status(404).send(e + "");
    }
})

router.delete('/users/deleteAll',  auth, permission('deleteAllUsers'), async(req, res) => {
    try{
        await User.deleteMany({});
        res.send("Successfully delete all users");
    }
    catch(e){
        res.status(500).send(e + "");
    }
})


module.exports = router;