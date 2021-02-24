const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    type: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, required: true},
    day: {type: mongoose.SchemaTypes.Date, required: true},
    recipeId: {type: Schema.Types.ObjectId, required: true}
});

module.exports = schema;