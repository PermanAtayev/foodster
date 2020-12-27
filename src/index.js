const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');

const userRouter = require('./routers/user');
const mealRouter = require('./routers/meal');
const dbRouter = require('./routers/db');
const recipeRouter = require('./routers/recipe');

const cors = require('cors');
app.use(cors());


// parse the incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// register routers
app.use('', userRouter);
app.use('', mealRouter);
app.use('', dbRouter);
app.use('', recipeRouter);

app.get('/', (req, res) => {
    res.send("Welcome to the REST API of Foodster");
})


app.listen(port, () => {
    console.log('Running at ', port);
})