const mongoose = require('mongoose');
const schema = require('../schema/measure');

const Measure = mongoose.model("Measure", schema);
module.exports = Measure;