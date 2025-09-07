const express = require("express");
const { checkValid } = require("../utils/middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const {
    validateConnectionRequest,
} = require("../utils/middlewares/connectionRequest");

const requestsRouter = express.Router();

requestsRouter.post(
    "/request/send/:status/:toUserId",
    checkValid,
    validateConnectionRequest,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const fromUserId = loggedInUser._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();

            res.json({
                message: "Connection Request Sent",
                data,
            });
        } catch (err) {
            res.status(400).send(err.message);
        }

        // res.send(req.user.firstName + "sent a request");
    }
);

module.exports = requestsRouter;
