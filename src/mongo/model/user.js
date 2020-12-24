const mongoose = require('mongoose');
const schema = require('../schema/user');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');

schema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1h'});

    if(!user.token)
        user.token = token;

    // if the token of the user has expired, the token needs to be updated
    try {
        jwt.verify(user.token, process.env.JWT_SECRET);
    }
    catch(e){
        user.token = token;
    }
    await user.save();
    return token;

}

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login, Password is wrong");
    }

    return user;
}

schema.pre("save", async function (next) {
    // console.log( this );
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    // important, because pre is a middleware that needs to point to the function that will be executed next
    next();
});

//before the user needs to be deleted
schema.pre("remove", async function (next) {
    const user = this;
    next();
});

const User = mongoose.model("User", schema);

module.exports = User;