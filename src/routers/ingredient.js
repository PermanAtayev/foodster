const express = require('express');
const router = express.Router();

const Ingredient = require('../mongo/model/ingredient');

// TODO implement
// TODO test
// router.post('/ingredients', async (req, res) => {
//     /*
//         #swagger.tags = ['Ingredient']
//         #swagger.description = 'Endpoint to add a ingredient'
//
//         #swagger.parameters['name'] = {
//             in: 'body',
//             description: 'Name of the ingredient',
//             required: true,
//             type: 'string',
//             schema: {
//                 "name":"Salt"
//             }
//          }
//
//         #swagger.responses[201] = {
//             description: "The ingredient is added succesfully"
//         }
//         #swagger.responses[400] = {
//             description: "Could not add the ingredient. [error]"
//         }
//     */
//     try{
//         const ingredient = new Ingredient(req.body);
//         await ingredient.save();
//
//         return res.status(201).send("The ingredient is added succesfully");
//     }
//     catch(e){
//         res.status(400).send("Could not add the ingredient. " + e);
//     }
// })

// TODO implement
// TODO test
// TODO document
// router.patch('/ingredients/:ingredientName', (req, res) => {
//
// })




module.exports = router