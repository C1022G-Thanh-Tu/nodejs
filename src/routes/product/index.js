"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helper/exceptionHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");

// authentication
router.use(authentication)

// logout
router.post("", asyncHandler(productController.createProduct));

module.exports = router;