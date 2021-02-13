const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');

const userRouter = require('./routers/user');
const mealRouter = require('./routers/meal');
const dbRouter = require('./routers/db');
const recipeRouter = require('./routers/recipe');
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


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//console.log("Docs running at: http://localhost:"+ port + "/docs");

app.get('/', (req, res) => {
    res.send("Welcome to the REST API of Foodster");
})

module.exports = app;