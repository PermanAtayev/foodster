const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');

const userRouter = require('./routers/user');
const mealRouter = require('./routers/meal');
const dbRouter = require('./routers/db');
const recipeRouter = require('./routers/recipe');
const ingredientRouter = require('./routers/ingredient')
const swaggerUi = require('swagger-ui-express')

const swaggerFile = require('./docs/swagger_output.json')

const cors = require('cors');

app.use(cors());
app.use(morgan(':method :url Status\: :status Response_Time\: :response-time'));

// parse the incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// register routers
app.use('/', userRouter);
app.use('/', mealRouter);
app.use('/', dbRouter);
app.use('/', recipeRouter);
app.use('/', ingredientRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get('/', (req, res) => {
    res.send("Welcome to the REST API of Foodster");
})

module.exports = app;