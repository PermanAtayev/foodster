const jwt = require('jsonwebtoken');
const User = require('../mongo/model/user');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'token' : token});

        if(!user){
            throw new Error('Something went wrong with finding a user');
        }

        req.user = user;
        req.token = token;
        next();
    }
    catch(e){
        console.log(e);
        res.status(401).send({ error: "Please authenticate" });
    }
}

module.exports = auth;