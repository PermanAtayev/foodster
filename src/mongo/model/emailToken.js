const mongoose = require('mongoose');
const schema = require('../schema/emailToken');

const EmailToken = mongoose.model("EmailToken", schema);

module.exports = EmailToken;