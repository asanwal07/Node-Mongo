const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = async () => {
    await mongoose.connect(process.env.DB_URI);
};

module.exports = connectDb;
