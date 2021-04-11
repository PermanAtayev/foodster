const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const Recipe = require('../mongo/model/recipe');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');

const fs = require('fs');

// let rawdata = fs.readFileSync('allrecipes_healthy.json');
// let recipes = JSON.parse(rawdata);


//
// router.delete('/db/drop', auth, permission('dropUsersDb'), async(req, res) => {
//     /*
//     #swagger.tags = ['DB']
//     #swagger.description = 'Drop a database'
//     */
//     try{
//         await db.dropCollection("Users");
//         res.status(200).send("Collections dropped successfully");
//     }
//     catch(e){
//         res.status(400).send(e + '');
//     }
// })

// router.post('/db/addMeal', auth, async(req, res) => {
//     /*
//     #swagger.tags = ['DB']
//     #swagger.description = 'Add a meal to the db and store the image in s3.'
//     */
//
//
// })

// router.get('/db/upload/:number', async(req, res) => {
//         const n = (req.params.number > recipes.length ? recipes.length : req.params.number);
//
//         for(let i = 0; i < n; i++){
//             const newRecipe = new Recipe(recipes[i]);
//
//             try{
//                 await newRecipe.save((err, doc) => {
//                     if(err)
//                         console.log(err);
//                 });
//             }
//             catch(e){
//                 res.status(409).send("Could not insert some or all recipes");
//             }
//         }
//
//         res.send("insertion is done.");
// })

module.exports = router;

