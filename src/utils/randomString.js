var randomstring = require("randomstring");

module.exports.genRandomstring = () => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return randomstring.generate({
        length: 2,
        charset: char,
    });
}