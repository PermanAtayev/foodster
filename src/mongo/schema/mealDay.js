const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    date: {
        type: Date,
        required: true
    },
    // list of meal ids stored in the db, if you want actual meals then populate this field
    meals: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal'
    }]
})

module.exports = schema;