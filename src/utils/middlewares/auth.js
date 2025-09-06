const jwt = require("jsonwebtoken");
const User = require("../../models/user");
require("dotenv").config();

const checkValid = async (req, res, next) => {
    // Read token , validate token and find user is there or not.
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid Token");
        }
        const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not Exist");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("Bad request");
    }
};

module.exports = {
    checkValid,
};
