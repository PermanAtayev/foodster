const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const userRouter = require('./routers/user')
const bodyParser = require('body-parser')

// parse the incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// register routers
app.use('', userRouter);


app.listen(port, () => {
    console.log('Running at ', port);
})