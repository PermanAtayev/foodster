const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measureSchema = require('./measure')

let schema = new Schema({
    // required by front end
    calories: {
        type: measureSchema,
        required: false
    },
    carbs: {
        type: measureSchema,
        required: false
    },
    proteins: {
        type: measureSchema,
        required: false
    },
    fats: {
        type: measureSchema,
        required: false
    },
    // If we end up having this data, needs to be changed to the format needed.
    micros:{ 
        type: [
                    {
                        name: String,
                        value: {
                            type: measureSchema,
                        }
                    }
                ],
        required: false
    }
})

module.exports = schema;