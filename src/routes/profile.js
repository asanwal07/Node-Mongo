const express = require("express");
const { checkValid } = require("../utils/middlewares/auth");
const bcrypt = require("bcrypt");
const {
    validateProfileEditData,
    validateExistingPassword,
} = require("../utils/validators");

const profileRouter = express.Router();

profileRouter.get("/myProfile", checkValid, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        throw new Error(err);
    }
});

profileRouter.patch("/profile/edit", checkValid, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            return res.status(400).send("Edit request is not valid");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(
            (item) => (loggedInUser[item] = req.body[item])
        );
        await loggedInUser.save();
        res.send("Data successfully updated");
    } catch (err) {
        res.send("Some Error Occurred" + err);
    }
});

profileRouter.patch("/profile/changePassword", checkValid, async (req, res) => {
    try {
        if (!validateExistingPassword(req)) {
            res.status(400).send("Existing password does not match");
        }

        const isValid = await validateExistingPassword(req);
        if (!isValid) {
            return res.status(400).send("Existing password does not match");
        }

        const loggedInUser = req.user;

        const newPassword = await bcrypt.hash(req.body.newPassword, 12);

        loggedInUser.password = newPassword;

        await loggedInUser.save();

        res.send("Password saved scuccesfully");
    } catch (err) {
        res.send("Password is not Valid" + err);
    }
});
module.exports = profileRouter;
