
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now}
});
module.exports = tokenSchema;