const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-type-email');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - permissions
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          permissions:
 *            type: array
 *            description: array of strings with permissions
 *        example:
 *           name: perman
 *           email: perman@email.com
 *           permissions:
 */


let schema = new Schema({
    email: {type: mongoose.SchemaTypes.Email, unique: true, required: true},
    password: {type: String, required: true},
    token: {type: String, required: false},
    permissions: {type: [String], required: true},
    // everything that is related to height, weight, age etc will go here.
    metadata: {type:JSON, required: false} 
});


module.exports = schema;