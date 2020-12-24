const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');

router.delete('/db/drop', async(req, res) => {
    try{
        await db.dropCollection("Users");
        res.status(200).send("Collections dropped successfully");
    }
    catch(e){
        res.status(400).send(e + '');
    }
})

module.exports = router;

