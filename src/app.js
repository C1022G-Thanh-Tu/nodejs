require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
const app = express();

// init middleware
app.use(morgan("dev")); // morgan dùng để log details about incoming requests and outgoing responses
app.use(helmet()); // dùng cho security (ví dụ ngăn chặn việc lấy thông tin Headers từ request)
app.use(compression()); // dùng để nén response body
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
// init DB
require("./db/init.mongodb");

// init routes
app.use("", require("./routes"))

// handle error
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        code: statusCode,
        message: error.message
    })
})

module.exports = app;
