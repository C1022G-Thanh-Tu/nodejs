"use strict";

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.v2");
const { CreatedResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const serviceRes = await ProductServiceV2.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    });
    new CreatedResponse({
      metadata: serviceRes,
    }).send(res);
  };
}

module.exports = new ProductController();
