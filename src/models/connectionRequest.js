const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: String,
            required: true,
        },
        toUserId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "rejected", "accepted", "interested"],
                message: `{VALUE} is incorrect status type.`,
            },
        },
    },
    { timestamps: true }
);

// Everytime before we save this pre will be called for connectionRequest.

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (
        connectionRequest.fromUserId.toString() === connectionRequest.toUserId
    ) {
        throw new Error("You cannot send request to yourself");
    }
    next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = connectionRequestModel;
