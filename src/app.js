require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
require("./db/init.mongodb");
const app = express();

// init middleware
app.use(morgan("dev")); // morgan dùng để log details about incoming requests and outgoing responses
app.use(helmet()); // dùng cho security (ví dụ ngăn chặn việc lấy thông tin Headers từ request)
app.use(compression()); // dùng để nén response body

// init DB


// init routes
app.use("", require("./routes"))

// handle error

module.exports = app;
