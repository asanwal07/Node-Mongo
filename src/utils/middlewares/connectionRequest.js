const { ALLOWED_STATUS_TYPES } = require("../index.js");
const User = require("../../models/user.js");
const ConnectionRequest = require("../../models/connectionRequest.js");

const validateConnectionRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id.toString();
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // if (fromUserId.toString() === toUserId) {
        //     return res.status(400).send("Connection Request is not valid.");
        // }

        if (!ALLOWED_STATUS_TYPES.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Type " + status,
            });
        }
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send("User not found.");
        }
        const isAlreadyRequested = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (isAlreadyRequested) {
            return res.status(400).send("Connection Request Already Exists");
        }
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    validateConnectionRequest,
};
