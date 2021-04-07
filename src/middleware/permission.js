const permission = function (permission) {
    return async (req, res, next) => {
        const user = req.user;
        if (!user) {
            console.log('Authorization Failed!');
            res.status(401).send({error: "Authorization required!"});
        }
        const hasPermission = await user.hasPermission(permission);
        if (!hasPermission) {
            console.log('User does not have this permission: ' + permission);
            res.status(403).send({error: "Permission Denied!"});
        }
        next();
    }
}
module.exports = permission;