"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helper/exceptionHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");

router.get("/search/:keySearch", asyncHandler(productController.searchProduct));

// authentication
router.use(authentication)

// logout
router.post("", asyncHandler(productController.createProduct));
router.post("/published/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublished/:id", asyncHandler(productController.unPublishProductByShop));
router.get("/drafts/all", asyncHandler(productController.findAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.findAllPublishedForShop));

module.exports = router;