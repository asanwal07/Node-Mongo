const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = async () => {
    await mongoose.connect(process.env.DB_URI);
};

module.exports = connectDb;

// mongodb+srv://akshit_backend_learn:<db_password>@cluster01.2ltujpz.mongodb.net/
