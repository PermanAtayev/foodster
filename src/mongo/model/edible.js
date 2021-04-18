const mongoose = require('mongoose');
const schema = require('../schema/edible');

const Edible = mongoose.model("Edible", schema);
module.exports = Edible;