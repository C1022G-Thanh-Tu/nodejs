"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, permissions } = require("../auth/checkAuth");
const { asyncHandler } = require("../helper/exceptionHandler");

// check apiKey
router.use(asyncHandler(apiKey));

// check permission
router.use(asyncHandler(permissions("0000")));

router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
