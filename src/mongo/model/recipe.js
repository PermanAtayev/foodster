const mongoose = require('mongoose');
const schema = require('../schema/user');




const Recipe = mongoose.model("Recipe", schema);

module.exports = User;