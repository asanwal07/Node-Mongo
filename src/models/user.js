const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const validator = require("validator");

const userScheme = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Please Enter a Valid Email");
                }
            },
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Entered gender is not allowed");
                }
            },
        },
        age: {
            type: Number,
        },
        photoUrl: {
            type: String,
            default:
                "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Please Enter a Valid URL");
                }
            },
        },
        about: {
            type: String,
            default: "Hey, there I am using this app.",
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

// moongoose schema methods.

// we can both the below things at api level also but this way of doing them using moongoose schema method is more better.

userScheme.methods.validatePassword = async function (enteredPassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(
        enteredPassword,
        user.password
    );

    return isPasswordValid;
};

userScheme.methods.getJwt = function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return token;
};

module.exports = mongoose.model("User", userScheme);

// = User;
