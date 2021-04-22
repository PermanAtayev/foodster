const mongoose = require('mongoose');
const schema = require('../schema/serving');

const Serving = mongoose.model("Serving", schema);
module.exports = Serving;