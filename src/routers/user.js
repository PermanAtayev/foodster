const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = require('../mongo/model/user')

router.post('/users/signup', async (req, res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        const token = user.generateAuthToken();
        return res.status(201).send(user);
    }
    catch (e){
        res.status(406).send(e + "");
    }
});

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send(user);
    }
    catch(e){
        res.status(400).send(e + "");
    }
})

router.get('/users/list', async (req, res) => {
    try{
        const users = await User.find({});
        console.log(users);
        return res.status(200).send('Found users');
    }
    catch(e){
        res.status(404).send(e + "");
    }
})


module.exports = router;