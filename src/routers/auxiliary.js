const express = require('express');
const router = express.Router();

router.get('/aux/supported_allergies', async (req, res) => {
    /*
        #swagger.tags = ['Auxiliary']
        #swagger.description = 'Endpoint to get all the supported allergy ingredients by foodster'

        #swagger.responses[200] = {
                "description": "JSON object with 'allergies' field that has an array of all supported diets."
        }
    */
    res.json({
        "allergies": ["milk", "egg", "peanuts", "cashews", "wheat", "soy", "fish", "nuts"]
    })
})

router.get('/aux/supported_diets', async (req, res) => {
    /*
        #swagger.tags = ['Auxiliary']
        #swagger.description = 'Endpoint to get all the supported diet names by Foodster'

        #swagger.responses[200] = {
                "description": "JSON object with 'diets' field that has an array of all supported diets."
        }
    */    res.json({
        "diets": ["vegan", "paleo", "keto", "vegetarian"]
    })
})


module.exports = router