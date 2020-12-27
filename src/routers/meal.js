const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = require('../mongo/model/user');
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth')

router.get('/meals/generateRandom', auth, async(req, res) => {
    const n = Recipe.count({});
    let r = Math.floor(Math.random() * n);
    let randomMeal = await Recipe.find({}).limit(1).skip(r);

    res.status(200).send(randomMeal);
})

module.exports = router;