const { validateSignupData } = require("../utils/validators");

require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        // 1.Validating input on api level.
        validateSignupData({ firstName, lastName, emailId, password });

        // 2.Enecryption of password.

        const hashPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
        });
        await user.save();
        res.send("User Saved Succesfully");
    } catch (err) {
        res.send("Some Error Occured" + err);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!User) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordCorrect = await user.validatePassword(password);

        if (isPasswordCorrect) {
            const token = await user.getJwt();
            res.cookie("token", token);

            const { firstName, lastName } = user;
            res.send({
                data: { firstName, lastName },
                message: "Login success",
            });
        } else {
            res.send(
                "Invalid Credentials(Please check Email or password again)."
            );
        }
    } catch (err) {
        res.send("Some Error Occured" + err);
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        }).send("Logged Out succesfully");
    } catch (err) {
        res.send(err);
    }
});

module.exports = authRouter;
