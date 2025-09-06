const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req;

    if (!firstName || !lastName) {
        throw new Error("Please enter name.");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Please enter valid Email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Enter Strong password");
    }
};

const validateProfileEditData = (req) => {
    const isAllowedFields = ["age", "about", "skills", "photoUrl", "gender"];

    const isAllowed = Object?.keys(req?.body).every((item) =>
        isAllowedFields?.includes(item)
    );

    const { age, gender, skills, about, photoUrl } = req.body;

    if (isNaN(age)) {
        throw new Error("Enter a valid age.");
    }
    if (!["male", "female", "others"].includes(gender?.toLowerCase())) {
        throw new Error("Enter a valid Gender.");
    }
    return isAllowed;
};

const validateExistingPassword = async (req) => {
    const loggedInUser = req.user;

    const isExistingPasswordMatching = await loggedInUser.validatePassword(
        req.body.password
    );

    return isExistingPasswordMatching;
};

module.exports = {
    validateSignupData,
    validateProfileEditData,
    validateExistingPassword,
};
