
const mcache = require('memory-cache');

// TODO needs to also save the format of the file and add that information to the header of the response.
const cache = (duration) => {
    return (req, res, next) => {
        // let key = '__express__' + (req.originalUrl || req.url) + "/" + (req.user ? req.user._id : "any");
        //
        // console.log(key);
        //
        // let cachedBody = mcache.get(key)
        // if (cachedBody) {
        //     res.set({"Content-Type": "application/json"});
        //     return res.send(cachedBody);
        // } else {
        //     res.sendResponse = res.send;
        //     res.send = (body) => {
        //         //mcache.put(key, body, duration * 1000);
        //         res.sendResponse(body);
        //     }
        //     next();
        // }
        next();
    }
}

module.exports = cache;