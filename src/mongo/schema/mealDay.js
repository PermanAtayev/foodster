const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    date: {
        type: Date,
        required: true
    },
    meals: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal'
    }]
})

module.exports = schema;