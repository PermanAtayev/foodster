const mongoose = require('mongoose');
const schema = require('../schema/measure');

schema.methods.toJSON = function() {
    let measure = this.toObject()
    delete measure.__v
    delete measure._id
    return measure
}

const Measure = mongoose.model("Measure", schema);
module.exports = Measure;