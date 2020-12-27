const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');

const fs = require('fs');

let rawdata = fs.readFileSync('allrecipes_healthy.json');
let recipes = JSON.parse(rawdata);

router.delete('/db/drop', async(req, res) => {
    try{
        await db.dropCollection("Users");
        res.status(200).send("Collections dropped successfully");
    }
    catch(e){
        res.status(400).send(e + '');
    }
})

router.get('/db/upload/:number', async(req, res) => {
    console.log(req.params.number);
    res.send(recipes[0]);
})

module.exports = router;

