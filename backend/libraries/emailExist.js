const User = require("../models/User");

const emailExist = async (email) => {
    const user = await User.findOne({ email: email });
    if (user) {
        return true;
    }
    return false;
};

module.exports = emailExist;
