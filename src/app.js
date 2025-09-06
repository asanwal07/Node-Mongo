const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDb = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestsRouter = require("./routes/requests.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

app.get("/", (req, res) => {
    res.send("Routes working fine.");
});

connectDb()
    .then(() => {
        console.log("Database connected");
        app.listen(8000, () => console.log("server started listening at"));
    })
    .catch((err) => console.log("Database cannot be connected"));
