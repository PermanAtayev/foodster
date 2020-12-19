let express = require('express');
let app = express();
let port = process.env.PORT || 8080;

app.get('/', (err, res) => {
    res.send('Welcome to foodster');


})


app.post('/signup', (err, res) => {
    let email = '1';
    let password = '1';


})

app.post('/login', (err, res) => {
//
})



app.listen(port, () => {
    console.log('Running at ', port);
})