const jwt = require('jsonwebtoken');
const User = require('../mongo/model/user');


const permission = function (permission) {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user){
                throw new Error('Authorization Failed!');
            }
            const hasPermission = await user.hasPermission(permission);
            if (!hasPermission){
                throw new Error('User does not have this permission: ' + permission);
            }
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).send({ error: "Permission Denied!" });
        }
    }
}
module.exports = permission;