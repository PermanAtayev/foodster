const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');

const userRouter = require('./routers/user');
const mealRouter = require('./routers/meal');

const cors = require('cors');
app.use(cors());


// parse the incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// register routers
app.use('', userRouter);
app.use('', mealRouter);

app.get('/', (req, res) => {
    res.send("Welcome to the REST API of Foodster");
})


app.listen(port, () => {
    console.log('Running at ', port);
})