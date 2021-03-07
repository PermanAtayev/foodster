const express = require('express');
const router = express.Router();

const Ingredient = require('../mongo/model/ingredient');

// TODO implement
// TODO test
// TODO document
router.post('/ingredients/addIngredient', async (req, res) => {
    try{
        const ingredient = new Ingredient(req.body);
        await ingredient.save();

        return res.status(201).send("The ingredient is added succesfully");
    }
    catch(e){
        res.status(400).send("Could not add the ingredient. " + e);
    }
})

// TODO implement
// TODO test
// TODO document
router.post('/ingredients/updateIngredient', (req, res) => {

})




module.exports = router