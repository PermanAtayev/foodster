const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Ingredient = require("../mongo/model/ingredient");
let conn_string = process.env.CONNECTION_STRING_DEV;

if (process.env.NODE_ENV === 'test') {
    conn_string = process.env.CONNECTION_STRING_TEST;
}
if (process.env.NODE_ENV === 'DEV_LOCAL') {
    conn_string = process.env.CONNECTION_STRING_DEV_LOCAL;
}
const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(conn_string, connectionOptions);
mongoose.Promise = global.Promise;


async function dropAll() {
    try {
        await Ingredient.deleteMany({});
        console.log("All ingredients are dropped");
    }
    catch(e){
        console.log(e);
    }
}

dropAll();
