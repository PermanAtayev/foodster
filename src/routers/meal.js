const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = require('../mongo/model/user');
const auth = require('../middleware/auth')

router.get('/meals/generate', auth, async(req, res) => {
    const random_meal = {
        "name" : "somsa",
        "cookingTime" : 50
    }
    res.send(random_meal);
})

module.exports = router;